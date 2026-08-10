import { Scholarship } from "./api/abroadlift";

export interface UserScholarshipProfile {
  gpa: number;
  englishScore: number;
  testType?: string;
  degreeLevel?: string;
  nationality?: string;
  preferredCountry?: string;
  backlogs?: number;
  studyGap?: number;
}

export interface ScholarshipEvaluationResult {
  isEligible: boolean;
  score: number; // 0 - 100
  status: "HIGHLY ELIGIBLE" | "ELIGIBLE" | "PARTIALLY ELIGIBLE" | "NOT ELIGIBLE";
  statusColor: string;
  badgeBg: string;
  badgeBorder: string;
  levelMatch: boolean;
  gpaMatch: boolean;
  languageMatch: boolean;
  nationalityMatch: boolean;
  reqGpa: number;
  reqIelts: number;
  matchReasons: string[];
  warningReasons: string[];
}

export function evaluateScholarship(
  user: UserScholarshipProfile,
  scholarship: Scholarship
): ScholarshipEvaluationResult {
  const matchReasons: string[] = [];
  const warningReasons: string[] = [];

  // Normalize user GPA (out of 4.0 scale)
  const userGpa = user.gpa > 4.0 ? (user.gpa / 100) * 4.0 : user.gpa || 0;
  
  // Normalize user IELTS equivalent
  let userIelts = user.englishScore || 0;
  if (user.testType) {
    const t = user.testType.toUpperCase();
    if (t.includes("TOEFL")) {
      userIelts = userIelts >= 100 ? 8.0 : userIelts >= 90 ? 7.0 : userIelts >= 80 ? 6.5 : 6.0;
    } else if (t.includes("PTE")) {
      userIelts = userIelts >= 76 ? 8.0 : userIelts >= 65 ? 7.0 : userIelts >= 58 ? 6.5 : 6.0;
    } else if (t.includes("DUOLINGO") || t.includes("DET")) {
      userIelts = userIelts >= 135 ? 8.0 : userIelts >= 120 ? 7.0 : userIelts >= 110 ? 6.5 : 6.0;
    }
  }

  // 1. Level Match Check
  let levelMatch = true;
  if (scholarship.eligible_levels && scholarship.eligible_levels.length > 0) {
    const userLvl = (user.degreeLevel || "").toLowerCase();
    const levelsStr = scholarship.eligible_levels.join(" ").toLowerCase();

    if (userLvl.includes("master") || userLvl.includes("postgrad")) {
      levelMatch = levelsStr.includes("master") || levelsStr.includes("postgraduate") || levelsStr.includes("all");
    } else if (userLvl.includes("bachelor") || userLvl.includes("undergrad")) {
      levelMatch = levelsStr.includes("bachelor") || levelsStr.includes("undergraduate") || levelsStr.includes("all");
    } else if (userLvl.includes("diploma") || userLvl.includes("certificate")) {
      levelMatch = levelsStr.includes("diploma") || levelsStr.includes("certificate") || levelsStr.includes("all");
    } else if (userLvl.includes("phd") || userLvl.includes("doctor")) {
      levelMatch = levelsStr.includes("doctoral") || levelsStr.includes("phd") || levelsStr.includes("all");
    }
  }

  if (levelMatch) {
    matchReasons.push(`Degree level (${user.degreeLevel || "Degree"}) is eligible for this award`);
  } else {
    warningReasons.push(`Target level (${user.degreeLevel || "Degree"}) does not match scholarship criteria`);
  }

  // 2. Extract Minimum Requirements from Description
  const desc = scholarship.description || "";
  let reqGpa = 3.0; // default benchmark
  let reqIelts = 6.5; // default benchmark

  const gpaRegex = /gpa\s*(?:of|>=|:|\s|>)?\s*([3-4]\.[0-9]+|[3-4]\.0)/i;
  const gpaMatch = desc.match(gpaRegex);
  if (gpaMatch && gpaMatch[1]) {
    reqGpa = parseFloat(gpaMatch[1]);
  }

  const ieltsRegex = /ielts\s*(?:of|>=|:|\s|>)?\s*([6-8]\.?[0-5]?)/i;
  const ieltsMatch = desc.match(ieltsRegex);
  if (ieltsMatch && ieltsMatch[1]) {
    reqIelts = parseFloat(ieltsMatch[1]);
  }

  // Check GPA Match
  const isGpaMatch = userGpa >= reqGpa || userGpa === 0;
  if (userGpa >= reqGpa && userGpa > 0) {
    matchReasons.push(`GPA ${userGpa.toFixed(2)} meets minimum requirement of ${reqGpa.toFixed(1)}`);
  } else if (userGpa > 0) {
    warningReasons.push(`GPA ${userGpa.toFixed(2)} is below recommended ${reqGpa.toFixed(1)}`);
  }

  // Check Language Match
  const isLanguageMatch = userIelts >= reqIelts || userIelts === 0;
  if (userIelts >= reqIelts && userIelts > 0) {
    matchReasons.push(`IELTS ${userIelts.toFixed(1)} meets required ${reqIelts.toFixed(1)}`);
  } else if (userIelts > 0) {
    warningReasons.push(`IELTS ${userIelts.toFixed(1)} is below required ${reqIelts.toFixed(1)}`);
  }

  // 3. Nationality Match Check
  let nationalityMatch = true;
  if (scholarship.eligible_nationalities && scholarship.eligible_nationalities.length > 0 && user.nationality) {
    const userNat = user.nationality.toLowerCase();
    nationalityMatch = scholarship.eligible_nationalities.some((n) => n.toLowerCase().includes(userNat));
    if (nationalityMatch) {
      matchReasons.push(`Nationality (${user.nationality}) is in approved regional list`);
    } else {
      warningReasons.push(`Country (${user.nationality}) is not listed in regional eligibility`);
    }
  } else {
    matchReasons.push("Open to all international fee-paying students");
  }

  // 4. Calculate Final Score & Status
  let score = 0;
  if (levelMatch) score += 35;
  if (isGpaMatch) score += 35;
  if (isLanguageMatch) score += 30;

  if (userGpa >= reqGpa + 0.3 && userGpa > 0) score += 5;
  if (userIelts >= reqIelts + 0.5 && userIelts > 0) score += 5;

  if ((user.backlogs || 0) > 2) score -= 15;
  if ((user.studyGap || 0) > 2) score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: ScholarshipEvaluationResult["status"] = "NOT ELIGIBLE";
  let statusColor = "text-rose-600";
  let badgeBg = "bg-rose-50 text-rose-700";
  let badgeBorder = "border-rose-100";

  if (score >= 85) {
    status = "HIGHLY ELIGIBLE";
    statusColor = "text-emerald-600";
    badgeBg = "bg-emerald-50 text-emerald-700";
    badgeBorder = "border-emerald-200";
  } else if (score >= 70) {
    status = "ELIGIBLE";
    statusColor = "text-blue-600";
    badgeBg = "bg-blue-50 text-blue-700";
    badgeBorder = "border-blue-200";
  } else if (score >= 50) {
    status = "PARTIALLY ELIGIBLE";
    statusColor = "text-amber-600";
    badgeBg = "bg-amber-50 text-amber-700";
    badgeBorder = "border-amber-200";
  }

  return {
    isEligible: score >= 50,
    score,
    status,
    statusColor,
    badgeBg,
    badgeBorder,
    levelMatch,
    gpaMatch: isGpaMatch,
    languageMatch: isLanguageMatch,
    nationalityMatch,
    reqGpa,
    reqIelts,
    matchReasons,
    warningReasons,
  };
}
