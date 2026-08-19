import { NextRequest, NextResponse } from "next/server";
import { parseGpaToFloat } from "@/lib/gpaConverter";

type MatchPayload = {
  countryCode?: string;
  name?: string;
};

type FormPayload = {
  bankBalance?: string;
  sponsorIncome?: string;
  backlogs?: string;
  studyGap?: string;
  docsReady?: boolean;
  passportReady?: boolean;
  testDone?: boolean;
  gpa?: string;
  testType?: string;
  testScore?: string;
  scholarship?: boolean;
  program?: string;
  intake?: string;
  countries?: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseNumber(value: string | undefined, fallback = 0) {
  const parsed = Number.parseFloat(value || "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getSuccessLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Moderate";
  return "High Vigilance";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      form?: FormPayload;
      match?: MatchPayload;
    };

    const form = body.form || {};
    const match = body.match || {};

    const hasFunds =
      parseNumber(form.bankBalance) > 0 || parseNumber(form.sponsorIncome) > 0;
    const backlogPenalty = Math.min(12, (parseNumber(form.backlogs) || 0) * 2);
    const gapPenalty = Math.min(10, (parseNumber(form.studyGap) || 0) * 2);
    const docsBonus = [
      form.passportReady,
      form.docsReady,
      form.testDone,
    ].filter(Boolean).length;

    const gpaFloat = parseGpaToFloat(form.gpa) ?? 0;
    const academicBase = clamp(
      Math.round((gpaFloat / 4) * 100),
      0,
      100,
    );
    const fundsBoost = hasFunds ? 12 : -18;
    const countryRisk = ["AU", "UK"].includes(match.countryCode || "") ? -8 : 0;

    const successChance = clamp(
      Math.round(
        70 +
          Math.round((docsBonus / 3) * 10) +
          (academicBase - 60) * 0.18 +
          fundsBoost -
          backlogPenalty -
          gapPenalty +
          countryRisk,
      ),
      30,
      98,
    );

    const readinessPercent = clamp(
      successChance - (hasFunds ? 0 : 8) + docsBonus * 2,
      18,
      96,
    );

    const guidance = [
      {
        title: "Proof of Funds",
        description: hasFunds
          ? `Financial capacity is available for ${match.countryCode || "your destination"}.`
          : "Add bank statements or sponsor support to strengthen the visa file.",
        status: hasFunds ? "VERIFIED" : "REQUIRED",
      },
      {
        title: "Statement of Purpose",
        description: form.program
          ? `Align the SOP with ${form.program} and your academic history.`
          : "Align the SOP with your academic history and study plan.",
        status: form.program ? "VERIFIED" : "REQUIRED",
      },
      {
        title: "Document Completeness",
        description: form.docsReady
          ? "Visa document pack is ready for submission."
          : "Finalize transcripts, passport scans, and supporting letters.",
        status: form.docsReady ? "VERIFIED" : "REQUIRED",
      },
      {
        title: "Travel Timeline",
        description: form.intake
          ? `Prepare the file around the ${form.intake} intake window.`
          : "Choose the intake window before booking the visa slot.",
        status: form.intake ? "VERIFIED" : "PENDING",
      },
    ];

    const checklist = [
      {
        title: "Passport",
        description: `Valid passport and identity records for ${match.countryCode || "the destination"}`,
        status: form.passportReady ? "complete" : "pending",
      },
      {
        title: "Financial Evidence",
        description: hasFunds
          ? "Bank statements and sponsor documents are available"
          : "Financial evidence still needs to be added",
        status: hasFunds ? "complete" : "loading",
      },
      {
        title: "Admission Offer",
        description: match.name
          ? `${match.name} is selected for the visa application`
          : "Selected admission offer",
        status: match.name ? "complete" : "pending",
      },
      {
        title: "Academic Records",
        description: form.gpa
          ? `CGPA ${form.gpa}, transcripts, and certificates`
          : "Transcripts and degree certificates",
        status: form.gpa ? "complete" : "pending",
      },
      {
        title: "English Test",
        description: form.testScore
          ? `${form.testType || "English test"} score is available`
          : "Add your language score before submission",
        status: form.testScore ? "complete" : "loading",
      },
      {
        title: "Intake Confirmation",
        description: form.intake
          ? `Application is tied to the ${form.intake} intake`
          : "Confirm your intake before visa filing",
        status: form.intake ? "complete" : "loading",
      },
      {
        title: "Submission Pack",
        description: form.docsReady
          ? "Final visa bundle is ready to submit"
          : "Finalize the submission bundle",
        status: form.docsReady ? "complete" : "loading",
      },
    ];

    return NextResponse.json({
      successChance,
      readinessPercent,
      label: getSuccessLabel(successChance),
      guidance,
      checklist,
      flags: {
        hasFunds,
        docsReady: !!form.docsReady,
        passportReady: !!form.passportReady,
        countryRisk: ["AU", "UK"].includes(match.countryCode || ""),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate visa prediction", detail: String(error) },
      { status: 500 },
    );
  }
}
