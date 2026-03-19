import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          nationality: true,
          currentCountry: true,
          gpa: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    username,
    email,
    nationality,
    currentCountry,
    gpa,
  } = body;

  // Check if username is taken by another user
  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "Username already taken." }, { status: 409 });
    }
  }

  // Check if email is taken by another user
  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== session.user.id) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name }),
      ...(username && { username: username.toLowerCase().trim() }),
      ...(email && { email: email.toLowerCase().trim() }),
      profile: {
        upsert: {
          create: {
            nationality: nationality || null,
            currentCountry: currentCountry || null,
            gpa: gpa ? parseFloat(gpa) : null,
          },
          update: {
            nationality: nationality || null,
            currentCountry: currentCountry || null,
            gpa: gpa ? parseFloat(gpa) : null,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profile: true,
    },
  });

  return NextResponse.json(user);
}
