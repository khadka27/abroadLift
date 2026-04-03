import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password are required." },
        { status: 400 },
      );
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Try email first, then username
    let user = await prisma.user.findUnique({
      where: { email: normalizedIdentifier },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { username: normalizedIdentifier },
        include: { profile: true },
      });
    }

    if (!user?.password) {
      return NextResponse.json(
        { error: "No account found with that email or username." },
        { status: 401 },
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("NEXTAUTH_SECRET is required for secure JWT issuance.");
    }

    const token = await encode({
      secret,
      maxAge: 60 * 60 * 24 * 7,
      token: {
        id: user.id,
        email: user.email,
        role: user.role,
        tokenType: "mobile",
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile,
      },
      token,
    });
  } catch (error) {
    console.error("[MOBILE_LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
