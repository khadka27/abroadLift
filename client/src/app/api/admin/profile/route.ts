/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phoneNumber, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Check if another user has the same email (excluding this admin)
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        id: { not: session.user.id },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email is already in use by another user" },
        { status: 409 },
      );
    }

    // Build the update payload
    const updateData: any = {
      name,
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber || null,
    };

    if (phoneNumber) {
      // Basic formatting, assumes + is included
      updateData.phoneE164 = phoneNumber;
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_PROFILE_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
