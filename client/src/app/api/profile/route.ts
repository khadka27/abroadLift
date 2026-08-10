import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";
import { abroadliftApi } from "@/lib/api/abroadlift";


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
    phoneNumber,
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
    dateOfBirth,
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
    // New fields
    workStatus,
    companyName,
    jobTitle,
    workExperience,
    emergencyName,
    emergencyRelation,
    emergencyPhone,
    emergencyEmail,
    prefersEmail,
    prefersSMS,
  } = body;

  const finalDegreeLevel = degreeLevel || degree;
  const finalPreferredCountry = preferredCountry || countries?.[0];
  const finalYearlyBudget = yearlyBudget || budget;
  const finalEnglishScore = englishScore ?? testScore;
  const finalScholarshipNeeded = scholarshipNeeded ?? scholarship;
  const finalDob = dob || dateOfBirth || null;

  if (finalDob) {
    const dobDate = new Date(finalDob);
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (isNaN(dobDate.getTime()) || finalDob > todayStr) {
      return NextResponse.json(
        { error: "Date of birth cannot be in the future or invalid." },
        { status: 400 }
      );
    }

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return NextResponse.json(
        { error: "Date of birth is invalid: Applicants must be at least 16 years old (Age 16+)." },
        { status: 400 }
      );
    }
  }

  // Validation: Numeric amounts and scores cannot be negative
  const gpaNum = toFloat(gpa);
  const budgetNum = toFloat(finalYearlyBudget);
  const bankNum = toFloat(bankBalance);
  const incomeNum = toFloat(sponsorIncome);
  const engNum = toFloat(finalEnglishScore);
  const backlogsNum = toInt(backlogs, 0);
  const gapNum = toInt(studyGap, 0);
  const workExpNum = toInt(workExperience, 0);
  const greVerbalNum = toFloat(greVerbal);
  const greQuantNum = toFloat(greQuant);
  const greAwaNum = toFloat(greAwa);
  const gmatNum = toFloat(gmatTotal);

  if (
    (gpaNum !== null && gpaNum < 0) ||
    (budgetNum !== null && budgetNum < 0) ||
    (bankNum !== null && bankNum < 0) ||
    (incomeNum !== null && incomeNum < 0) ||
    (engNum !== null && engNum < 0) ||
    (backlogsNum < 0) ||
    (gapNum < 0) ||
    (workExpNum < 0) ||
    (greVerbalNum !== null && greVerbalNum < 0) ||
    (greQuantNum !== null && greQuantNum < 0) ||
    (greAwaNum !== null && greAwaNum < 0) ||
    (gmatNum !== null && gmatNum < 0)
  ) {
    return NextResponse.json(
      { error: "Amounts, budgets, balances, GPA, scores, and experience cannot be negative numbers." },
      { status: 400 }
    );
  }

  const uniquenessError = await ensureUniqueFields({
    userId: userIdSource,
    username,
    email,
  });
  if (uniquenessError) return uniquenessError;

  const scoreBundle = computeProfileScores({
    gpaVal: gpaNum ?? 3,
    testScoreVal: engNum ?? 0,
    bankBalanceVal: bankNum ?? 0,
    passportReady,
    docsReady,
    yearlyBudgetVal: budgetNum ?? 20000,
  });

  const profileData = {
    nationality: nationality || null,
    currentCountry: currentCountry || null,
    highestEducation: highestEducation || null,
    passingYear: passingYear || null,
    gpa: gpaNum,
    backlogs: Math.max(0, backlogsNum),
    studyGap: Math.max(0, gapNum),
    hasEnglishTest: hasEnglishTest ?? null,
    testType: testType || null,
    englishScore: engNum,
    aptitudeTest: aptitudeTest || null,
    greVerbal: greVerbalNum,
    greQuant: greQuantNum,
    greAwa: greAwaNum,
    gmatTotal: gmatNum,
    degreeLevel: finalDegreeLevel || null,
    field: field || null,
    program: program || null,
    preferredCountry: finalPreferredCountry || null,
    intake: intake || null,
    yearlyBudget: budgetNum,
    currency: currency || "USD",
    bankBalance: bankNum,
    sponsorType: sponsorType || null,
    sponsorIncome: incomeNum,
    univType: univType || null,
    cityType: cityType || null,
    duration: toInt(duration, 0) || null,
    scholarshipNeeded: finalScholarshipNeeded ?? false,
    loanWilling: loanWilling ?? false,
    passportReady: passportReady ?? false,
    testDone: testDone ?? false,
    docsReady: docsReady ?? false,
    middleName: middleName || null,
    dob: finalDob,
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
    // New fields
    workStatus: workStatus || null,
    companyName: companyName || null,
    jobTitle: jobTitle || null,
    workExperience: Math.max(0, workExpNum),
    emergencyName: emergencyName || null,
    emergencyRelation: emergencyRelation || null,
    emergencyPhone: emergencyPhone || null,
    emergencyEmail: emergencyEmail || null,
    prefersEmail: prefersEmail ?? true,
    prefersSMS: prefersSMS ?? false,
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
      ...(phoneNumber && { phoneNumber: phoneNumber.trim(), phoneE164: phoneNumber.trim() }),
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
      phoneNumber: true,
      profile: true,
    },
  });

  // Sync profile to external AbroadLift API database
  try {
    const gpaRaw = toFloat(gpa) ?? 3.0;
    let gpaGrade = gpaRaw;
    if (gpaRaw > 10.0) {
      // Percentage scale -> 4.0 scale
      gpaGrade = (gpaRaw / 100) * 4.0;
    } else if (gpaRaw > 4.0) {
      // 10.0 scale -> 4.0 scale
      gpaGrade = (gpaRaw / 10) * 4.0;
    }
    // Round to 2 decimal places
    gpaGrade = Math.round(gpaGrade * 100) / 100;

    const engScore = toFloat(finalEnglishScore) ?? 6.5;

    await abroadliftApi.saveStudentProfile({
      name: user.name || name || "Student",
      gpa: gpaGrade,
      english_score: engScore,
      gap_years: toInt(studyGap, 0),
      backlogs: toInt(backlogs, 0),
      work_experience: toInt(studyGap, 0) > 0 ? toInt(studyGap, 0) : 1,
      available_funds: toFloat(bankBalance) ?? toFloat(finalYearlyBudget) ?? 45000,
      sponsor_type: sponsorType || "parents",
    });
  } catch (error) {
    console.error("Failed to sync profile to AbroadLift API:", error);
  }

  return NextResponse.json(user);
}
