import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formData, matchData } = body;

    if (!formData || !matchData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Try to find if the university exists in our DB to link it
    let universityId = null;
    if (matchData.id && typeof matchData.id === 'string') {
        const univ = await prisma.university.findUnique({
            where: { id: matchData.id }
        });
        if (univ) universityId = univ.id;
    }

    // Save the matching record
    const record = await prisma.matchingRecord.create({
      data: {
        userId: session.user.id,
        universityId: universityId,
        formData: formData,
        matchData: matchData,
      },
    });

    // Also update the user's StudentProfile with the filled details
    try {
      const gpaNum = formData.gpa ? parseFloat(formData.gpa) : null;
      const budgetNum = formData.budget ? parseFloat(formData.budget) : null;
      const englishScoreNum = formData.testScore ? parseFloat(formData.testScore) : null;
      const backlogsNum = parseInt(formData.backlogs) || 0;
      const studyGapNum = parseInt(formData.studyGap) || 0;
      const bankBalanceNum = formData.bankBalance ? parseFloat(formData.bankBalance) : null;
      const sponsorIncomeNum = formData.sponsorIncome ? parseFloat(formData.sponsorIncome) : null;
      const durationNum = parseInt(formData.duration) || null;

      const profileData = {
        nationality: formData.nationality || undefined,
        currentCountry: formData.currentCountry || undefined,
        highestEducation: formData.highestEducation || undefined,
        passingYear: formData.passingYear || undefined,
        gpa: isNaN(gpaNum as any) ? null : gpaNum,
        backlogs: isNaN(backlogsNum) ? 0 : backlogsNum,
        studyGap: isNaN(studyGapNum) ? 0 : studyGapNum,
        hasEnglishTest: formData.hasEnglishTest ?? undefined,
        testType: formData.testType || undefined,
        englishScore: isNaN(englishScoreNum as any) ? null : englishScoreNum,
        aptitudeTest: formData.aptitudeTest || "NONE",
        greVerbal: formData.greVerbal ? parseFloat(formData.greVerbal) : undefined,
        greQuant: formData.greQuant ? parseFloat(formData.greQuant) : undefined,
        greAwa: formData.greAwa ? parseFloat(formData.greAwa) : undefined,
        gmatTotal: formData.gmatTotal ? parseFloat(formData.gmatTotal) : undefined,
        degreeLevel: formData.degree || undefined,
        field: formData.field || undefined,
        program: formData.program || undefined,
        preferredCountry: formData.countries?.[0] || undefined,
        intake: formData.intake || undefined,
        yearlyBudget: isNaN(budgetNum as any) ? null : budgetNum,
        currency: formData.currency || "USD",
        bankBalance: isNaN(bankBalanceNum as any) ? null : bankBalanceNum,
        sponsorType: formData.sponsorType || undefined,
        sponsorIncome: isNaN(sponsorIncomeNum as any) ? null : sponsorIncomeNum,
        univType: formData.univType || undefined,
        cityType: formData.cityType || undefined,
        duration: isNaN(durationNum as any) ? null : durationNum,
        scholarshipNeeded: formData.scholarship ?? false,
        passportReady: formData.passportReady ?? false,
        testDone: formData.testDone ?? false,
        docsReady: formData.docsReady ?? false,
      };

      await prisma.studentProfile.upsert({
        where: { userId: session.user.id },
        update: profileData,
        create: {
          ...profileData,
          userId: session.user.id,
        }
      });
    } catch (profileError) {
      console.error("[PROFILE_SYNC_ERROR]", profileError);
      // We don't fail the whole request if profile sync fails, 
      // as the matching record itself is more important.
    }

    return NextResponse.json({ success: true, id: record.id });
  } catch (error: unknown) {
    console.error("[MATCH_SAVE_ERROR]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
