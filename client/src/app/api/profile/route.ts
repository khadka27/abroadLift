import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";

async function ensureUniqueFields(params: {
  userId: string;
  username?: string;
  email?: string;
}) {
  const { userId, username, email } = params;

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== userId) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 409 },
      );
    }
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== userId) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 },
      );
    }
  }

  return null;
}

function computeProfileScores(params: {
  gpaVal: number;
  testScoreVal: number;
  bankBalanceVal: number;
  passportReady?: boolean;
  docsReady?: boolean;
  yearlyBudgetVal: number;
}) {
  const {
    gpaVal,
    testScoreVal,
    bankBalanceVal,
    passportReady,
    docsReady,
    yearlyBudgetVal,
  } = params;

  let admissionProb = 50;
  if (gpaVal >= 3.5) admissionProb += 20;
  else if (gpaVal >= 3) admissionProb += 10;
  if (testScoreVal >= 7 || testScoreVal >= 100) admissionProb += 15;
  admissionProb = Math.min(95, admissionProb);

  let visaSuccessProb = 60;
  if (passportReady) visaSuccessProb += 10;
  if (docsReady) visaSuccessProb += 10;
  if (bankBalanceVal > 3000000) visaSuccessProb += 15;
  visaSuccessProb = Math.min(98, visaSuccessProb);

  return {
    admissionProb,
    visaSuccessProb,
    estimatedAnnualCost: yearlyBudgetVal + 12000,
  };
}

function toFloat(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== "string") return null;
  if (!value.trim()) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toInt(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.trunc(value) : fallback;
  }
  if (typeof value !== "string" || !value.trim()) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

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
    testScore,
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
    scholarship,
    loanWilling,
    passportReady,
    testDone,
    docsReady,
    middleName,
    dob,
    firstLanguage,
    citizenshipCountry,
    passportNumber,
    passportExpiryDate,
    maritalStatus,
    gender,
    addressLine,
    cityTown,
    provinceState,
    postalZipCode,
    countryOfEducation,
    graduatedInstitution,
  } = body;

  const finalDegreeLevel = degreeLevel || degree;
  const finalPreferredCountry = preferredCountry || countries?.[0];
  const finalYearlyBudget = yearlyBudget || budget;
  const finalEnglishScore = englishScore ?? testScore;
  const finalScholarshipNeeded = scholarshipNeeded ?? scholarship;

  const uniquenessError = await ensureUniqueFields({
    userId: userIdSource,
    username,
    email,
  });
  if (uniquenessError) return uniquenessError;

  const scoreBundle = computeProfileScores({
    gpaVal: toFloat(gpa) ?? 3,
    testScoreVal: toFloat(finalEnglishScore) ?? 0,
    bankBalanceVal: toFloat(bankBalance) ?? 0,
    passportReady,
    docsReady,
    yearlyBudgetVal: toFloat(finalYearlyBudget) ?? 20000,
  });

  const profileData = {
    nationality: nationality || null,
    currentCountry: currentCountry || null,
    highestEducation: highestEducation || null,
    passingYear: passingYear || null,
    gpa: toFloat(gpa),
    backlogs: toInt(backlogs, 0),
    studyGap: toInt(studyGap, 0),
    hasEnglishTest: hasEnglishTest ?? null,
    testType: testType || null,
    englishScore: toFloat(finalEnglishScore),
    aptitudeTest: aptitudeTest || null,
    greVerbal: toFloat(greVerbal),
    greQuant: toFloat(greQuant),
    greAwa: toFloat(greAwa),
    gmatTotal: toFloat(gmatTotal),
    degreeLevel: finalDegreeLevel || null,
    field: field || null,
    program: program || null,
    preferredCountry: finalPreferredCountry || null,
    intake: intake || null,
    yearlyBudget: toFloat(finalYearlyBudget),
    currency: currency || "USD",
    bankBalance: toFloat(bankBalance),
    sponsorType: sponsorType || null,
    sponsorIncome: toFloat(sponsorIncome),
    univType: univType || null,
    cityType: cityType || null,
    duration: toInt(duration, 0) || null,
    scholarshipNeeded: finalScholarshipNeeded ?? false,
    loanWilling: loanWilling ?? false,
    passportReady: passportReady ?? false,
    testDone: testDone ?? false,
    docsReady: docsReady ?? false,
    middleName: middleName || null,
    dob: dob || null,
    firstLanguage: firstLanguage || null,
    citizenshipCountry: citizenshipCountry || null,
    passportNumber: passportNumber || null,
    passportExpiryDate: passportExpiryDate || null,
    maritalStatus: maritalStatus || null,
    gender: gender || null,
    addressLine: addressLine || null,
    cityTown: cityTown || null,
    provinceState: provinceState || null,
    postalZipCode: postalZipCode || null,
    countryOfEducation: countryOfEducation || null,
    graduatedInstitution: graduatedInstitution ?? false,
    admissionProb: scoreBundle.admissionProb,
    visaSuccessProb: scoreBundle.visaSuccessProb,
    estimatedAnnualCost: scoreBundle.estimatedAnnualCost,
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
