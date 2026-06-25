import { NextRequest, NextResponse } from "next/server";

type MatchPayload = {
  admissionRate?: number;
  tuitionFee?: number;
  rankingWorld?: number;
  rankingNational?: number;
  englishReq?: number;
  gpaRequirement?: number;
  internationalPercentage?: number;
  countryCode?: string;
  name?: string;
};

type FormPayload = {
  gpa?: string;
  testType?: string;
  testScore?: string;
  backlogs?: string;
  studyGap?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function bandForScore(score: number) {
  if (score >= 80) {
    return {
      label: "Strong",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }

  if (score >= 60) {
    return {
      label: "Moderate",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
    };
  }

  return {
    label: "Selective",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-100",
  };
}

function parseNumber(value: string | undefined, fallback = 0) {
  const parsed = Number.parseFloat(value || "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Helper to convert any English test score to the IELTS scale (out of 9.0)
function convertToIelts(score: number, testType: string): number {
  const type = (testType || "").toUpperCase();
  if (type === "IELTS") {
    return score;
  }
  if (type === "TOEFL") {
    // TOEFL to IELTS mapping (standard ETS mapping)
    if (score >= 118) return 9.0;
    if (score >= 115) return 8.5;
    if (score >= 110) return 8.0;
    if (score >= 94) return 7.5;
    if (score >= 79) return 7.0;
    if (score >= 60) return 6.5;
    if (score >= 46) return 6.0;
    if (score >= 35) return 5.5;
    if (score >= 32) return 5.0;
    return 4.5;
  }
  if (type === "PTE" || type.includes("PTE")) {
    // PTE to IELTS mapping
    if (score >= 86) return 9.0;
    if (score >= 83) return 8.5;
    if (score >= 79) return 8.0;
    if (score >= 73) return 7.5;
    if (score >= 65) return 7.0;
    if (score >= 58) return 6.5;
    if (score >= 50) return 6.0;
    if (score >= 43) return 5.5;
    if (score >= 36) return 5.0;
    return 4.5;
  }
  if (type === "DUOLINGO" || type.includes("DUOLINGO") || type.includes("DET")) {
    // Duolingo to IELTS mapping
    if (score >= 155) return 9.0;
    if (score >= 145) return 8.5;
    if (score >= 135) return 8.0;
    if (score >= 125) return 7.5;
    if (score >= 115) return 7.0;
    if (score >= 105) return 6.5;
    if (score >= 95) return 6.0;
    if (score >= 85) return 5.5;
    if (score >= 75) return 5.0;
    return 4.5;
  }
  // Fallback: if it's already a small number, assume it's on the IELTS scale
  if (score <= 9.0) return score;
  return 6.0; // default fallback
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      form?: FormPayload;
      match?: MatchPayload;
    };

    const form = body.form || {};
    const match = body.match || {};

    // ─── STEP 1: CHECK MINIMUM ELIGIBILITY ─────────────────────────────────────
    
    // 1. English Score Normalization
    const actualEnglishRaw = parseNumber(form.testScore, 0);
    const actIelts = convertToIelts(actualEnglishRaw, form.testType || "IELTS");
    const reqIelts = match.englishReq ?? 6.0; // College minimum IELTS

    // 2. CGPA Normalization & Scale Alignment
    let actGpa = parseNumber(form.gpa, 0);
    const reqGpa = match.gpaRequirement ?? 3.0; // College minimum GPA

    // Detect scales: 4.0, 10.0, or 100.0 (percentage)
    const studentScale = actGpa <= 4.0 ? 4.0 : actGpa <= 10.0 ? 10.0 : 100.0;
    const collegeScale = reqGpa <= 4.0 ? 4.0 : reqGpa <= 10.0 ? 10.0 : 100.0;

    // Convert student's GPA to match the college's scale for a fair comparison
    if (studentScale !== collegeScale) {
      actGpa = (actGpa / studentScale) * collegeScale;
    }

    const fullGpa = collegeScale;

    // Check baseline eligibility rules
    const meetsEnglish = actIelts >= reqIelts;
    const meetsGpa = actGpa >= reqGpa;
    const isEligible = meetsEnglish && meetsGpa;

    let admissionPct = 0;
    let ieltsFit = 0;
    let gpaFit = 0;

    if (isEligible) {
      // ─── STEP 2: CALCULATE IELTS FIT SCORE ───────────────────────────────────
      const ieltsDiff = 9.0 - reqIelts;
      ieltsFit = ieltsDiff > 0 
        ? 70 + 30 * ((Math.min(9.0, actIelts) - reqIelts) / ieltsDiff)
        : 100;

      // ─── STEP 3: CALCULATE CGPA FIT SCORE ────────────────────────────────────
      const gpaDiff = fullGpa - reqGpa;
      gpaFit = gpaDiff > 0
        ? 70 + 30 * ((Math.min(fullGpa, actGpa) - reqGpa) / gpaDiff)
        : 100;

      // ─── STEP 4: APPLY WEIGHTS ───────────────────────────────────────────────
      // IELTS Fit (40%) + CGPA Fit (60%)
      const finalScore = (ieltsFit * 0.4) + (gpaFit * 0.6);
      admissionPct = clamp(Math.round(finalScore), 0, 100);
    }

    const lowerBound = isEligible ? clamp(admissionPct - 5, 5, 95) : 0;
    const upperBound = isEligible ? clamp(admissionPct + 5, lowerBound + 5, 98) : 0;
    
    const band = isEligible 
      ? bandForScore(admissionPct)
      : { label: "Ineligible", badgeClass: "bg-rose-50 text-rose-700 border-rose-100" };

    return NextResponse.json({
      admissionPct,
      lowerBound,
      upperBound,
      band,
      factors: {
        academicScore: Math.round(gpaFit),
        englishScore: Math.round(ieltsFit),
        isEligible,
        requiredIelts: reqIelts,
        actualIelts: actIelts,
        requiredGpa: reqGpa,
        actualGpa: actGpa,
        fullGpa,
      },
      summary: isEligible
        ? (admissionPct >= 78 ? "Strong Proceed" : "Proceed With Conditions")
        : "Ineligible - below minimum requirement",
      sources: {
        match: match.name || null,
        countryCode: match.countryCode || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate admission chance", detail: String(error) },
      { status: 500 },
    );
  }
}
