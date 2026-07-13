/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

// PUT /api/admin/admins/[id] — update name/email/phone or reset password (SUPERADMIN only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || session.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = (await params).id;
    const { name, email, phoneNumber, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Prevent editing the superadmin themselves via this route
    const target = await prisma.user.findUnique({ where: { id: adminId } });
    if (!target || target.role !== "ADMIN") {
      return NextResponse.json({ error: "Target admin not found" }, { status: 404 });
    }

    // Check email uniqueness
    const emailConflict = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), id: { not: adminId } },
    });
    if (emailConflict) {
      return NextResponse.json({ error: "Email already in use by another account" }, { status: 409 });
    }

    const updateData: any = {
      name,
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber || null,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: adminId },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE_ADMIN",
        entityType: "USER",
        entityId: adminId,
      },
    });

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: { id: updated.id, name: updated.name, email: updated.email },
    });
  } catch (error: any) {
    console.error("[ADMINS_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/admins/[id] — remove an ADMIN account (SUPERADMIN only)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || session.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = (await params).id;

    const target = await prisma.user.findUnique({ where: { id: adminId } });
    if (!target || target.role !== "ADMIN") {
      return NextResponse.json({ error: "Target admin not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: adminId } });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE_ADMIN",
        entityType: "USER",
        entityId: adminId,
      },
    });

    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error: any) {
    console.error("[ADMINS_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
