import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";

// Helper to map DB status to UI stage
function mapDbStatusToStage(status: string): "Draft" | "Submitted" | "Under Review" | "Offer Received" | "Rejected" | "Accepted" {
  switch (status) {
    case "APPLIED":
      return "Submitted";
    case "ACCEPTED":
      return "Accepted";
    case "REJECTED":
      return "Rejected";
    case "SAVED":
    default:
      return "Draft";
  }
}

// Helper to map UI stage to DB status
function mapStageToDbStatus(stage: string): "SAVED" | "APPLIED" | "ACCEPTED" | "REJECTED" {
  switch (stage) {
    case "Submitted":
    case "Under Review":
      return "APPLIED";
    case "Offer Received":
    case "Accepted":
      return "ACCEPTED";
    case "Rejected":
      return "REJECTED";
    case "Draft":
    default:
      return "SAVED";
  }
}

/* ── GET /api/applications ───────────────────────────────────── */
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawApps = await prisma.application.findMany({
      where: { studentId: userId },
      include: {
        university: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const applications = rawApps.map((app) => ({
      id: app.id,
      universityId: app.universityId,
      universityName: app.university?.name || "University",
      country: app.university?.country || "Canada",
      programName: app.university?.degreeLevel ? `${app.university.degreeLevel} in ${app.university.fieldCategory}` : "Academic Degree Program",
      stage: mapDbStatusToStage(app.status),
      appliedDate: app.createdAt.toISOString().slice(0, 10),
      intake: "Fall " + app.createdAt.getFullYear(),
      fee: `$${app.university?.tuitionFee ? "100" : "0"} USD`,
      feePaid: app.status !== "SAVED",
      applicationDeadline: new Date(app.createdAt.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      documentsAttached: app.status === "SAVED" ? 2 : 4,
      totalDocumentsRequired: 4,
      scholarshipApplied: true,
      notes: app.reviewerComments || (app.status === "SAVED" ? "Application saved as draft." : "Application active in student portal."),
    }));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("[GET_APPLICATIONS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

/* ── POST /api/applications ───────────────────────────────────── */
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { universityId, universityName, country, programName, stage, intake, fee, notes } = body;

    let targetUniId = universityId;

    if (!targetUniId && universityName) {
      const existingUni = await prisma.university.findFirst({
        where: {
          name: { contains: universityName.trim(), mode: "insensitive" },
        },
      });

      if (existingUni) {
        targetUniId = existingUni.id;
      } else {
        const newUni = await prisma.university.create({
          data: {
            name: universityName.trim(),
            country: country || "Canada",
            city: country || "Main Campus",
            tuitionFee: 15000,
            avgLivingCost: 10000,
            ieltsRequirement: 6.5,
            degreeLevel: programName || "Bachelor",
            fieldCategory: "General Studies",
          },
        });
        targetUniId = newUni.id;
      }
    }

    if (!targetUniId) {
      return NextResponse.json({ error: "University is required." }, { status: 400 });
    }

    const dbStatus = mapStageToDbStatus(stage || "Draft");

    const appRecord = await prisma.application.upsert({
      where: {
        studentId_universityId: {
          studentId: userId,
          universityId: targetUniId,
        },
      },
      update: {
        status: dbStatus,
        reviewerComments: notes || undefined,
      },
      create: {
        studentId: userId,
        universityId: targetUniId,
        status: dbStatus,
        reviewerComments: notes || "Newly created application.",
      },
      include: {
        university: true,
      },
    });

    const formattedApp = {
      id: appRecord.id,
      universityId: appRecord.universityId,
      universityName: appRecord.university?.name || universityName || "University",
      country: appRecord.university?.country || country || "Canada",
      programName: programName || (appRecord.university?.degreeLevel ? `${appRecord.university.degreeLevel} in ${appRecord.university.fieldCategory}` : "Academic Program"),
      stage: mapDbStatusToStage(appRecord.status),
      appliedDate: appRecord.createdAt.toISOString().slice(0, 10),
      intake: intake || "Fall 2026",
      fee: fee || "$100 USD",
      feePaid: appRecord.status !== "SAVED",
      applicationDeadline: new Date(appRecord.createdAt.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      documentsAttached: appRecord.status === "SAVED" ? 2 : 4,
      totalDocumentsRequired: 4,
      scholarshipApplied: true,
      notes: appRecord.reviewerComments || "Application recorded.",
    };

    return NextResponse.json({ application: formattedApp }, { status: 201 });
  } catch (error) {
    console.error("[POST_APPLICATION_ERROR]", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

/* ── PATCH /api/applications ───────────────────────────────────── */
export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, stage, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
    }

    const dbStatus = mapStageToDbStatus(stage || status || "Draft");

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: dbStatus,
        ...(notes ? { reviewerComments: notes } : {}),
      },
      include: {
        university: true,
      },
    });

    const formattedApp = {
      id: updated.id,
      universityId: updated.universityId,
      universityName: updated.university?.name || "University",
      country: updated.university?.country || "Canada",
      programName: updated.university?.degreeLevel ? `${updated.university.degreeLevel} in ${updated.university.fieldCategory}` : "Academic Program",
      stage: mapDbStatusToStage(updated.status),
      appliedDate: updated.createdAt.toISOString().slice(0, 10),
      intake: "Fall 2026",
      fee: "$100 USD",
      feePaid: updated.status !== "SAVED",
      applicationDeadline: new Date(updated.createdAt.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      documentsAttached: 4,
      totalDocumentsRequired: 4,
      scholarshipApplied: true,
      notes: updated.reviewerComments || "Status updated.",
    };

    return NextResponse.json({ application: formattedApp });
  } catch (error) {
    console.error("[PATCH_APPLICATION_ERROR]", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

/* ── DELETE /api/applications ──────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    await prisma.application.deleteMany({
      where: {
        id,
        studentId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_APPLICATION_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
