import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, username, password, phoneNumber, role } = await req.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: "User or email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        phoneNumber,
        role: role || "STUDENT",
        // Create an empty profile for them
        profile: {
          create: {}
        }
      }
    });

    return NextResponse.json({ 
        message: "User created successfully", 
        user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    });

  } catch (error: any) {
    console.error("[ADMIN_USER_REGISTER]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
