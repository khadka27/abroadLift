/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendApplicationStatusEmail } from "@/lib/email";

export async function GET(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";

    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { university: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status !== "ALL") {
      whereClause.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          university: {
            select: { id: true, name: true, country: true },
          },
        },
      }),
      prisma.application.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { applicationId, status, reviewerComments } = data;

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        ...(reviewerComments !== undefined && { reviewerComments }),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: `UPDATE_APPLICATION_STATUS_TO_${status}`,
        entityType: "APPLICATION",
        entityId: applicationId,
      }
    });

    // Send email notification to the student
    try {
      const appDetails = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          user: true,
          university: true,
        },
      });

      if (appDetails && appDetails.user?.email) {
        sendApplicationStatusEmail({
          to: appDetails.user.email,
          studentName: appDetails.user.name,
          universityName: appDetails.university.name,
          country: appDetails.university.country,
          status: status,
          reviewerComments: reviewerComments !== undefined ? reviewerComments : appDetails.reviewerComments,
        }).catch((err) => {
          console.error("[APPLICATION_UPDATE_NOTIFICATION] Email error:", err);
        });
      }
    } catch (emailErr) {
      console.error("[APPLICATION_UPDATE_NOTIFICATION] Lookup error:", emailErr);
    }

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
