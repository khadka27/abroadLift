/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

// PUT /api/admin/users/[id] — update details (name, email, phone) or reset password or update status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).id;
    const currentAdminRole = session.user.role;
    const body = await request.json();

    // Fetch the target user to check permissions
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role Guard: Standard admin can only modify STUDENTS
    if (currentAdminRole === "ADMIN" && targetUser.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden: Admins can only manage students" }, { status: 403 });
    }

    // Prevent modifying oneself
    if (userId === session.user.id && body.action !== "UPDATE_STATUS") {
      return NextResponse.json({ error: "To edit your own profile, use the My Profile settings" }, { status: 400 });
    }

    // Handle Status Toggle
    if (body.action === "UPDATE_STATUS") {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: body.isActive },
      });

      await prisma.auditLog.create({
        data: {
          adminId: session.user.id,
          action: body.isActive ? "REACTIVATE_ACCOUNT" : "SUSPEND_ACCOUNT",
          entityType: "USER",
          entityId: userId,
        },
      });

      return NextResponse.json({ success: true, isActive: updatedUser.isActive });
    }

    // Handle Update details or Reset Password
    const { name, email, phoneNumber, password } = body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) {
      const emailLower = email.toLowerCase().trim();
      // Check if email already in use
      const emailConflict = await prisma.user.findFirst({
        where: { email: emailLower, id: { not: userId } },
      });
      if (emailConflict) {
        return NextResponse.json({ error: "Email is already in use by another user" }, { status: 409 });
      }
      updateData.email = emailLower;
    }

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber || null;
    }

    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE_USER",
        entityType: "USER",
        entityId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — remove user account (superadmin can delete anyone, admin can delete students)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).id;
    const currentAdminRole = session.user.role;

    // Fetch the target user to check permissions
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role Guard: Standard admin can only delete STUDENTS
    if (currentAdminRole === "ADMIN" && targetUser.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden: Admins can only manage students" }, { status: 403 });
    }

    // Prevent deleting self
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account from the dashboard" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE_USER",
        entityType: "USER",
        entityId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
