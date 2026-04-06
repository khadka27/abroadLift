import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const userIdSource = await getUserIdFromRequest(req);
  if (!userIdSource) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, matchingRecords] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userIdSource },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        phoneE164: true,
        role: true,
        createdAt: true,
        profile: true, // Fetch entire profile
      },
    }),
    prisma.matchingRecord.findMany({
      where: { userId: userIdSource },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ...user, matchingRecords });
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
    highestEducation,
    passingYear,
    gpa,
    backlogs,
    studyGap,
    hasEnglishTest,
    testType,
    englishScore,
    aptitudeTest,
    greVerbal,
    greQuant,
    greAwa,
    gmatTotal,
    degree,
    degreeLevel,
    field,
    program,
    countries,
    preferredCountry,
    intake,
    budget,
    yearlyBudget,
    currency,
    bankBalance,
    sponsorType,
    sponsorIncome,
    univType,
    cityType,
    duration,
    scholarshipNeeded,
    loanWilling,
    passportReady,
    testDone,
    docsReady,
  } = body;

  const finalDegreeLevel = degreeLevel || degree;
  const finalPreferredCountry = preferredCountry || (countries && countries[0]);
  const finalYearlyBudget = yearlyBudget || budget;

  // Check if username is taken
  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== userIdSource) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 409 },
      );
    }
  }

  // Check if email is taken
  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== userIdSource) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 },
      );
    }
  }

  // Calculate probabilities and estimates locally for the Profile
  const gpaVal = gpa ? parseFloat(gpa) : 3.0;
  const testScoreVal = englishScore ? parseFloat(englishScore) : 0;

  let admissionProb = 50;
  if (gpaVal >= 3.5) admissionProb += 20;
  else if (gpaVal >= 3.0) admissionProb += 10;
  if (testScoreVal >= 7.0 || testScoreVal >= 100) admissionProb += 15;
  admissionProb = Math.min(95, admissionProb);

  let visaSuccessProb = 60;
  if (passportReady) visaSuccessProb += 10;
  if (docsReady) visaSuccessProb += 10;
  if (bankBalance && parseFloat(bankBalance) > 3000000) visaSuccessProb += 15;
  visaSuccessProb = Math.min(98, visaSuccessProb);

  const estimatedAnnualCost =
    (yearlyBudget ? parseFloat(yearlyBudget) : 20000) + 12000;

  const profileData = {
    nationality: nationality || null,
    currentCountry: currentCountry || null,
    highestEducation: highestEducation || null,
    passingYear: passingYear || null,
    gpa: gpa ? parseFloat(gpa) : null,
    backlogs: backlogs ? parseInt(backlogs) : 0,
    studyGap: studyGap ? parseInt(studyGap) : 0,
    hasEnglishTest: hasEnglishTest ?? null,
    testType: testType || null,
    englishScore: englishScore ? parseFloat(englishScore) : null,
    aptitudeTest: aptitudeTest || null,
    greVerbal: greVerbal ? parseFloat(greVerbal) : null,
    greQuant: greQuant ? parseFloat(greQuant) : null,
    greAwa: greAwa ? parseFloat(greAwa) : null,
    gmatTotal: gmatTotal ? parseFloat(gmatTotal) : null,
    degreeLevel: finalDegreeLevel || null,
    field: field || null,
    program: program || null,
    preferredCountry: finalPreferredCountry || null,
    intake: intake || null,
    yearlyBudget: finalYearlyBudget ? parseFloat(finalYearlyBudget) : null,
    currency: currency || "USD",
    bankBalance: bankBalance ? parseFloat(bankBalance) : null,
    sponsorType: sponsorType || null,
    sponsorIncome: sponsorIncome ? parseFloat(sponsorIncome) : null,
    univType: univType || null,
    cityType: cityType || null,
    duration: duration ? parseInt(duration) : null,
    scholarshipNeeded: scholarshipNeeded ?? false,
    loanWilling: loanWilling ?? false,
    passportReady: passportReady ?? false,
    testDone: testDone ?? false,
    docsReady: docsReady ?? false,
    admissionProb,
    visaSuccessProb,
    estimatedAnnualCost,
  };

  const user = await prisma.user.update({
    where: { id: userIdSource },
    data: {
      ...(name && { name }),
      ...(username && { username: username.toLowerCase().trim() }),
      ...(email && { email: email.toLowerCase().trim() }),
      profile: {
        upsert: {
          create: profileData,
          update: profileData,
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
