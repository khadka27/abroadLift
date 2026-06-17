import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

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

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
