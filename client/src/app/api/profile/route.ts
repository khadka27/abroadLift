import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const userIdSource = await getUserIdFromRequest(req);
  if (!userIdSource) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userIdSource },
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
          fieldOfStudy: true,
          degreeLevel: true,
          testType: true,
          recentAcademicField: true,
          passoutYear: true,
          intake: true,
          englishLevel: true,
          englishScore: true,
          yearlyBudget: true,
          scholarshipNeeded: true,
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
  const userIdSource = await getUserIdFromRequest(req);
  if (!userIdSource) {
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
    fieldOfStudy,
    degreeLevel,
    testType,
    recentAcademicField,
    passoutYear,
    intake,
    englishLevel,
    englishScore,
    yearlyBudget,
  } = body;

  // Check if username is taken by another user
  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== userIdSource) {
      return NextResponse.json({ error: "Username already taken." }, { status: 409 });
    }
  }

  // Check if email is taken by another user
  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== userIdSource) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }
  }

  const user = await prisma.user.update({
    where: { id: userIdSource },
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
            fieldOfStudy: fieldOfStudy || null,
            degreeLevel: degreeLevel || null,
            testType: testType || null,
            recentAcademicField: recentAcademicField || null,
            passoutYear: passoutYear || null,
            intake: intake || null,
            englishLevel: englishLevel || null,
            englishScore: englishScore ? parseFloat(englishScore) : null,
            yearlyBudget: yearlyBudget ? parseFloat(yearlyBudget) : null,
          },
          update: {
            nationality: nationality || null,
            currentCountry: currentCountry || null,
            gpa: gpa ? parseFloat(gpa) : null,
            fieldOfStudy: fieldOfStudy || null,
            degreeLevel: degreeLevel || null,
            testType: testType || null,
            recentAcademicField: recentAcademicField || null,
            passoutYear: passoutYear || null,
            intake: intake || null,
            englishLevel: englishLevel || null,
            englishScore: englishScore ? parseFloat(englishScore) : null,
            yearlyBudget: yearlyBudget ? parseFloat(yearlyBudget) : null,
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
