import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = (await params).id;
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: "STUDENT" },
      include: {
        profile: true,
        applications: {
          include: { university: true },
          orderBy: { createdAt: "desc" },
        },
        visaChecks: {
          orderBy: { createdAt: "desc" },
        },
        adminNotes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Due to Prisma schema, AdminNote needs to fetch admin details if we didn't set up the relation correctly in schema.
    // Let's verify relation. Wait, schema.prisma only has:
    // model AdminNote { adminId String ... } but no relation defined to Admin user.
    // So we'll fetch admin names manually for the notes.
    const adminIds = (student.adminNotes as any[]).map(n => n.adminId);
    const admins = await prisma.user.findMany({
      where: { id: { in: adminIds } },
      select: { id: true, name: true }
    });
    
    const notesWithAdmins = (student.adminNotes as any[]).map(note => ({
      ...note,
      adminName: admins.find(a => a.id === note.adminId)?.name || "Unknown Admin"
    }));

    return NextResponse.json({
      ...student,
      adminNotes: notesWithAdmins
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = (await params).id;
    const data = await request.json();

    // Determine what action is being performed
    if (data.action === "UPDATE_STATUS") {
      const updatedUser = await prisma.user.update({
        where: { id: studentId },
        data: { isActive: data.isActive },
      });
      
      // Audit log
      await prisma.auditLog.create({
        data: {
          adminId: session.user.id,
          action: data.isActive ? "REACTIVATE_ACCOUNT" : "SUSPEND_ACCOUNT",
          entityType: "USER",
          entityId: studentId,
        }
      });

      return NextResponse.json({ success: true, isActive: updatedUser.isActive });
    } 
    
    if (data.action === "ADD_NOTE") {
      const note = await prisma.adminNote.create({
        data: {
          studentId: studentId,
          adminId: session.user.id,
          content: data.content,
        }
      });
      return NextResponse.json({ success: true, note });
    }

    // Default: update profile
    if (data.profile) {
      await prisma.studentProfile.update({
        where: { userId: studentId },
        data: data.profile,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = (await params).id;

    await prisma.user.delete({
      where: { id: studentId },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE_ACCOUNT",
        entityType: "USER",
        entityId: studentId,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
