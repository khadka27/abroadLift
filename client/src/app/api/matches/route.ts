/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAllSchoolsCached, getSchoolsCached, getProgramsMultiPageCached } from "@/lib/api/cache";

function getProgramField(prog: any): string {
  const n = (prog.name || "").trim().toLowerCase();
  const cip = (prog.cip_code || "").trim();
  const cipPrefix = cip.split(".")[0];

  if (cipPrefix === "11") {
    return "Computer Science & IT";
  } else if (cip.startsWith("30.30") || cip.startsWith("30.70") || cip.startsWith("30.71") || n.includes("data science") || n.includes("artificial intelligence")) {
    return "Data Science & AI";
  } else if (cipPrefix === "52") {
    if (cip.startsWith("52.09") || n.includes("hospitality") || n.includes("tourism") || n.includes("hotel")) {
      return "Hospitality & Tourism";
    } else {
      return "Business & Management";
    }
  } else if (cipPrefix === "14") {
    return "Engineering";
  } else if (cipPrefix === "51" || cipPrefix === "26") {
    return "Medicine & Health";
  } else if (cipPrefix === "22") {
    return "Law";
  } else if (cipPrefix === "42" || cipPrefix === "45") {
    return "Social Sciences";
  } else if (cipPrefix === "04") {
    return "Architecture & Design";
  } else if (cipPrefix === "01" || cipPrefix === "03") {
    return "Agriculture & Forestry";
  } else if (cipPrefix === "13") {
    return "Education & Teaching";
  } else if (cipPrefix === "09") {
    return "Media & Journalism";
  } else if (cipPrefix === "40") {
    return "Natural Sciences";
  } else if (cipPrefix === "50" || cipPrefix === "54" || cipPrefix === "16" || cipPrefix === "23" || cipPrefix === "38") {
    return "Arts & Humanities";
  } else {
    // Fallback keyword check if CIP code is missing or unclassified
    if (n.includes("computer") || n.includes("software") || n.includes("information technology") || n.includes("cybersecurity") || n.includes("networking") || n.includes("systems") || n.includes("developer")) {
      return "Computer Science & IT";
    } else if (n.includes("data science") || n.includes("artificial intelligence") || n.includes("machine learning") || n.includes("deep learning")) {
      return "Data Science & AI";
    } else if (n.includes("business") || n.includes("management") || n.includes("mba") || n.includes("finance") || n.includes("marketing") || n.includes("accounting") || n.includes("commerce") || n.includes("economics") || n.includes("administration")) {
      return "Business & Management";
    } else if (n.includes("mechanical") || n.includes("civil") || n.includes("electrical") || n.includes("chemical") || n.includes("aerospace") || n.includes("mechatronics") || n.includes("engineering")) {
      return "Engineering";
    } else if (n.includes("nurs") || n.includes("medicine") || n.includes("health") || n.includes("pharmacy") || n.includes("medical") || n.includes("dental") || n.includes("clinical")) {
      return "Medicine & Health";
    } else if (n.includes("law") || n.includes("legal") || n.includes("justice") || n.includes("criminology")) {
      return "Law";
    } else if (n.includes("sociology") || n.includes("psychology") || n.includes("political") || n.includes("social science") || n.includes("global studies") || n.includes("international relations")) {
      return "Social Sciences";
    } else if (n.includes("hospitality") || n.includes("tourism") || n.includes("hotel") || n.includes("culinary") || n.includes("event management")) {
      return "Hospitality & Tourism";
    } else if (n.includes("architecture") || n.includes("interior design") || n.includes("urban planning") || n.includes("graphic design")) {
      return "Architecture & Design";
    } else if (n.includes("agriculture") || n.includes("forestry") || n.includes("horticulture") || n.includes("environmental science")) {
      return "Agriculture & Forestry";
    } else if (n.includes("education") || n.includes("teaching") || n.includes("curriculum") || n.includes("pedagogy")) {
      return "Education & Teaching";
    } else if (n.includes("media") || n.includes("journalism") || n.includes("communication") || n.includes("broadcasting") || n.includes("film")) {
      return "Media & Journalism";
    } else if (n.includes("biology") || n.includes("chemistry") || n.includes("physics") || n.includes("mathematics") || n.includes("math") || n.includes("science")) {
      return "Natural Sciences";
    } else if (n.includes("art") || n.includes("humanities") || n.includes("music") || n.includes("history") || n.includes("philosophy") || n.includes("english literature") || n.includes("language") || n.includes("literature")) {
      return "Arts & Humanities";
    }
  }
  return "Liberal Arts & General";
}

function cleanProgramTitle(rawProg: string, field: string, degreeLevel: string): string {
  const cleaned = (rawProg || "").trim();

  if (cleaned) {
    // e.g. "Master of Accountancy - Accountancy" -> "Master of Accountancy"
    const parts = cleaned.split(/\s*-\s*/);
    if (parts.length > 1) {
      const firstPart = parts[0].trim();
      const lastPart = parts[parts.length - 1].trim();

      if (firstPart.toLowerCase().includes(lastPart.toLowerCase()) || lastPart.toLowerCase().includes(firstPart.toLowerCase())) {
        return firstPart;
      }
    }
    return cleaned;
  }

  // Fallback title from degreeLevel and field
  let levelPrefix = "Degree in";
  const dlLower = (degreeLevel || "").toLowerCase();
  if (dlLower.includes("bachelor")) levelPrefix = "Bachelor of";
  else if (dlLower.includes("master")) levelPrefix = "Master of";
  else if (dlLower.includes("diploma")) levelPrefix = "Diploma in";
  else if (dlLower.includes("cert")) levelPrefix = "Certificate in";
  else if (dlLower.includes("doctor") || dlLower.includes("phd")) levelPrefix = "PhD in";

  if (field) {
    return `${levelPrefix} ${field}`;
  }

  return "Academic Degree Program";
}


const COUNTRY_ALIAS_TO_CODE: Record<string, string> = {
  US: "USA",
  USA: "USA",
  "UNITED STATES": "USA",
  UK: "UK",
  GB: "UK",
  "UNITED KINGDOM": "UK",
  CA: "CA",
  CANADA: "CA",
  AU: "AU",
  AUSTRALIA: "AU",
  DE: "DE",
  GERMANY: "DE",
  JP: "JP",
  JAPAN: "JP",
  KR: "KR",
  KOREA: "KR",
  KOREAN: "KR",
  "SOUTH KOREA": "KR",
  "REPUBLIC OF KOREA": "KR",
  IE: "IE",
  IRELAND: "IE",
  NL: "NL",
  NETHERLANDS: "NL",
  FR: "FR",
  FRANCE: "FR",
  IT: "IT",
  ITALY: "IT",
  ES: "ES",
  SPAIN: "ES",
  SE: "SE",
  SWEDEN: "SE",
  CH: "CH",
  SWITZERLAND: "CH",
  NZ: "NZ",
  "NEW ZEALAND": "NZ",
  SG: "SG",
  SINGAPORE: "SG",
  AE: "AE",
  UAE: "AE",
  "UNITED ARAB EMIRATES": "AE",
};

function normalizeCountryCode(country: string): string {
  const key = (country || "").trim().toUpperCase();
  if (!key) return "";
  return COUNTRY_ALIAS_TO_CODE[key] || key;
}

const DEFAULT_COUNTRIES = process.env.POPULAR_STUDY_COUNTRIES || "CA,US";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countriesParam = searchParams.get("countries") || DEFAULT_COUNTRIES;
  const selectedCountries = countriesParam
    .split(",")
    .map((country) => normalizeCountryCode(country))
    .filter(Boolean);
  const budget = Number.parseFloat(searchParams.get("budget") || "0");
  const degreeLevel = searchParams.get("degreeLevel") || "";
  const field = searchParams.get("field") || "";
  const program = searchParams.get("program") || "";
  const userGpa = Number.parseFloat(searchParams.get("gpa") || "0");
  const testType = (searchParams.get("testType") || "").toUpperCase();
  const rawTestScore = Number.parseFloat(searchParams.get("testScore") || "0");
  const intake = searchParams.get("intake") || "";
  const intakeYear = searchParams.get("intakeYear") || "";

  // Normalize user English test score to IELTS 0-9 scale
  let normalizedIelts = 0;
  if (rawTestScore > 0) {
    if (testType.includes("IELTS")) {
      normalizedIelts = rawTestScore;
    } else if (testType.includes("TOEFL")) {
      normalizedIelts = rawTestScore >= 100 ? 8.0 : rawTestScore >= 90 ? 7.0 : rawTestScore >= 80 ? 6.5 : rawTestScore >= 70 ? 6.0 : 5.5;
    } else if (testType.includes("PTE")) {
      normalizedIelts = rawTestScore >= 76 ? 8.0 : rawTestScore >= 65 ? 7.0 : rawTestScore >= 58 ? 6.5 : rawTestScore >= 50 ? 6.0 : 5.5;
    } else if (testType.includes("DUOLINGO") || testType.includes("DET")) {
      normalizedIelts = rawTestScore >= 135 ? 8.0 : rawTestScore >= 120 ? 7.0 : rawTestScore >= 110 ? 6.5 : rawTestScore >= 100 ? 6.0 : 5.5;
    } else {
      normalizedIelts = rawTestScore;
    }
  }

  const hasCriteria = !!(degreeLevel || field || program || budget > 0 || userGpa > 0 || rawTestScore > 0);

  try {
    // 1. Fetch remote cached schools/programs
    const schools = await getAllSchoolsCached();
    const programs = await getProgramsMultiPageCached(35);

    const programsBySchool = new Map<number, any[]>();
    for (const prog of programs) {
      const sId = prog.school_id;
      if (!programsBySchool.has(sId)) {
        programsBySchool.set(sId, []);
      }
      programsBySchool.get(sId)!.push(prog);
    }

    const matchedSchoolsList = schools.map((school: any) => {
      const schoolCountry = normalizeCountryCode(school.country_code || school.country || "");
      if (selectedCountries.length > 0 && !selectedCountries.includes(schoolCountry)) {
        return null;
      }

      const schoolPrograms = programsBySchool.get(school.school_id) || [];

      // Filter programs by criteria
      const matchingPrograms = schoolPrograms.filter((prog: any) => {
        const pNameLower = prog.name?.toLowerCase() || "";
        const pLevelLower = prog.level?.toLowerCase() || "";
        const pLevelTextLower = prog.level_text?.toLowerCase() || "";

        if (degreeLevel) {
          const dlLower = degreeLevel.toLowerCase();

          let matchesLevel = false;
          if (dlLower.includes("bachelor") && (pNameLower.includes("bachelor") || pLevelLower.includes("bachelor") || pLevelTextLower.includes("bachelor") || pLevelLower.includes("undergraduate"))) {
            matchesLevel = true;
          } else if ((dlLower.includes("master") || dlLower.includes("pg") || dlLower.includes("postgraduate")) && (pNameLower.includes("master") || pNameLower.includes("msc") || pNameLower.includes("mba") || pNameLower.includes("ma ") || pNameLower.includes("m.s.") || pLevelLower.includes("master") || pLevelLower.includes("postgraduate") || pLevelTextLower.includes("master") || pLevelTextLower.includes("postgraduate"))) {
            matchesLevel = true;
          } else if ((dlLower.includes("doctor") || dlLower.includes("phd")) && (pNameLower.includes("doctor") || pNameLower.includes("phd") || pLevelLower.includes("doctor") || pLevelLower.includes("phd") || pLevelTextLower.includes("doctor") || pLevelTextLower.includes("phd"))) {
            matchesLevel = true;
          } else if (dlLower.includes("diploma") && (pNameLower.includes("diploma") || pLevelLower.includes("diploma") || pLevelTextLower.includes("diploma"))) {
            matchesLevel = true;
          } else if (dlLower.includes("certificate") && (pNameLower.includes("certificate") || pLevelLower.includes("certificate") || pLevelTextLower.includes("certificate"))) {
            matchesLevel = true;
          } else if (pNameLower.includes(dlLower) || pLevelLower.includes(dlLower) || pLevelTextLower.includes(dlLower)) {
            matchesLevel = true;
          }

          if (!matchesLevel) return false;
        }

        if (field) {
          const progField = getProgramField(prog);
          if (progField.toLowerCase() !== field.toLowerCase()) {
            return false;
          }
        }

        if (program) {
          const targetProgLower = program.toLowerCase();
          const cleanTarget = program.replace(/\s*-\s*[A-Za-z0-9\s]+$/, "").toLowerCase().trim();

          const matchDirect = pNameLower.includes(targetProgLower) || targetProgLower.includes(pNameLower);
          const matchClean = cleanTarget.length > 2 && (pNameLower.includes(cleanTarget) || cleanTarget.includes(pNameLower));

          // Fuzzy keyword match: e.g. "accountancy" <-> "accounting"
          const keywords = targetProgLower.split(/[\s,/-]+/).filter((w) => w.length > 3 && !["master", "bachelor", "degree", "diploma", "science", "arts", "study", "program"].includes(w));
          const matchKeyword = keywords.length > 0 && keywords.some((kw) => {
            if (pNameLower.includes(kw)) return true;
            if (kw.startsWith("account") && pNameLower.includes("account")) return true;
            if (kw.startsWith("financ") && pNameLower.includes("financ")) return true;
            if (kw.startsWith("manag") && pNameLower.includes("manag")) return true;
            if (kw.startsWith("softwar") && pNameLower.includes("softwar")) return true;
            return false;
          });

          if (!matchDirect && !matchClean && !matchKeyword) {
            return false;
          }
        }

        if (budget > 0) {
          const tuitionVal = parseFloat(String(prog.tuition || 0));
          if (tuitionVal > 0 && tuitionVal > budget * 1.25) {
            return false;
          }
        }

        return true;
      });

      // Build relevant display programs list
      let displayPrograms: string[] = [];
      if (matchingPrograms.length > 0) {
        displayPrograms = matchingPrograms.slice(0, 3).map((p: any) => p.name);
      } else {
        // Fallback 1: Programs in schoolPrograms matching field or degreeLevel (excluding ESL)
        const fieldOrLevelPrograms = schoolPrograms.filter((prog: any) => {
          const pNameLower = prog.name?.toLowerCase() || "";
          const pLevelLower = prog.level?.toLowerCase() || "";

          if ((field || degreeLevel) && (pLevelLower.includes("english") || pNameLower.includes("english academic preparation") || pNameLower.includes("english language"))) {
            return false;
          }

          if (field) {
            const progField = getProgramField(prog);
            if (progField.toLowerCase() === field.toLowerCase()) return true;
          }
          if (degreeLevel) {
            const dlLower = degreeLevel.toLowerCase();
            if (dlLower.includes("master") && (pNameLower.includes("master") || pLevelLower.includes("master") || pNameLower.includes("msc") || pNameLower.includes("mba"))) return true;
            if (dlLower.includes("bachelor") && (pNameLower.includes("bachelor") || pLevelLower.includes("bachelor"))) return true;
          }
          return false;
        });

        if (fieldOrLevelPrograms.length > 0) {
          displayPrograms = fieldOrLevelPrograms.slice(0, 3).map((p: any) => p.name);
        } else {
          // Fallback 2: Display user's target program/field cleanly instead of irrelevant ESL course
          const userTargetTitle = cleanProgramTitle(program, field, degreeLevel);
          if (hasCriteria && (program || field || degreeLevel)) {
            displayPrograms = [userTargetTitle];
          } else {
            const nonEsl = schoolPrograms.filter((p: any) => !(p.name?.toLowerCase().includes("english academic") || p.level === "english"));
            displayPrograms = (nonEsl.length > 0 ? nonEsl : schoolPrograms).slice(0, 3).map((p: any) => p.name);
          }
        }
      }

      const rank = school.school_rank || 500;
      const admissionRate = Math.min(95, Math.max(25, 98 - Math.round(Math.log10(rank + 1) * 15)));
      const primaryProgram = matchingPrograms[0] || schoolPrograms.find((p: any) => displayPrograms.includes(p.name)) || schoolPrograms[0];

      // Extract exact tuition fee directly from API program or school data
      let tuitionFee = 0;
      const matchingTuitions = matchingPrograms
        .map((p: any) => parseFloat(String(p.tuition || 0)))
        .filter((t: number) => !isNaN(t) && t > 0);

      if (matchingTuitions.length > 0) {
        tuitionFee = Math.round(matchingTuitions.reduce((a: number, b: number) => a + b, 0) / matchingTuitions.length);
      } else {
        const schoolTuitions = schoolPrograms
          .map((p: any) => parseFloat(String(p.tuition || 0)))
          .filter((t: number) => !isNaN(t) && t > 0);

        if (schoolTuitions.length > 0) {
          tuitionFee = Math.round(schoolTuitions.reduce((a: number, b: number) => a + b, 0) / schoolTuitions.length);
        } else {
          const rawSchoolTuition = school.tuition || school.tuitionFee || school.tuition_fee || school.avg_tuition;
          if (rawSchoolTuition && !isNaN(parseFloat(String(rawSchoolTuition))) && parseFloat(String(rawSchoolTuition)) > 0) {
            tuitionFee = parseFloat(String(rawSchoolTuition));
          }
        }
      }

      const schoolIeltsReqs = schoolPrograms
        .map((p: any) => parseFloat(String(p.requirements?.min_ielts_average || 0)))
        .filter((req: number) => !isNaN(req) && req > 0);

      const matchingIeltsReqs = matchingPrograms
        .map((p: any) => parseFloat(String(p.requirements?.min_ielts_average || 0)))
        .filter((req: number) => !isNaN(req) && req > 0);

      const englishReq = primaryProgram?.requirements?.min_ielts_average
        ? parseFloat(String(primaryProgram.requirements.min_ielts_average))
        : matchingIeltsReqs.length > 0
        ? Math.min(...matchingIeltsReqs)
        : schoolIeltsReqs.length > 0
        ? Math.min(...schoolIeltsReqs)
        : rank <= 100
        ? 7.0
        : rank <= 500
        ? 6.5
        : 6.0;

      const gpaRequirement = primaryProgram?.requirements?.min_gpa
        ? parseFloat(String(primaryProgram.requirements.min_gpa))
        : 3.0;

      // ─── Calculate Dynamic Match Score (0 - 100%) and Match Reasons ───────────────────
      const matchReasons: string[] = [];

      // Normalize gpaRequirement to 4.0 scale if raw value is on a 100-point percentage scale
      const normalizedGpaReq = gpaRequirement > 4.0 ? Math.round(((gpaRequirement / 100) * 4.0) * 10) / 10 : gpaRequirement;

      // ─── Filter Out Ineligible Universities (Admission Chance 0%) ─────────────
      const isGpaIneligible = userGpa > 0 && userGpa < normalizedGpaReq;
      const isEnglishIneligible =
        normalizedIelts > 0 &&
        (
          normalizedIelts < englishReq ||
          (testType.includes("TOEFL") && primaryProgram?.requirements?.min_toefl_total && rawTestScore < parseFloat(String(primaryProgram.requirements.min_toefl_total))) ||
          (testType.includes("PTE") && primaryProgram?.requirements?.min_pte_overall && rawTestScore < parseFloat(String(primaryProgram.requirements.min_pte_overall))) ||
          ((testType.includes("DUOLINGO") || testType.includes("DET")) && primaryProgram?.requirements?.min_duolingo_score && rawTestScore < parseFloat(String(primaryProgram.requirements.min_duolingo_score)))
        );

      if (isGpaIneligible || isEnglishIneligible || school.admissionRate === 0) {
        return null; // Do not display university if user does not meet GPA/English requirements
      }

      // 1. Academic GPA Score (Granular based on exact user GPA vs school min GPA)
      const gpaDiff = userGpa > 0 ? userGpa - normalizedGpaReq : 0;
      let gpaPts = 24;
      if (userGpa > 0) {
        // Dynamic scaling: +4 pts per 0.5 GPA surplus, down to min 10 pts
        gpaPts = Math.min(30, Math.max(10, 24 + gpaDiff * 6));
        const reqDisp = `${normalizedGpaReq}`;
        if (gpaDiff >= 0.3) {
          matchReasons.push(`GPA (${userGpa}) exceeds min requirement (${reqDisp})`);
        } else if (gpaDiff >= 0) {
          matchReasons.push(`GPA (${userGpa}) meets requirement (${reqDisp})`);
        } else {
          matchReasons.push(`GPA (${userGpa}) near threshold (${reqDisp})`);
        }
      } else {
        matchReasons.push("Academic background eligible");
      }

      // 2. English Proficiency Score (Granular based on exact user test score vs school min requirement)
      const engDiff = normalizedIelts > 0 ? normalizedIelts - englishReq : 0;
      let englishPts = 20;
      if (normalizedIelts > 0) {
        englishPts = Math.min(25, Math.max(10, 20 + engDiff * 5));
        if (engDiff >= 0.5) {
          matchReasons.push(`English score (${rawTestScore} ${testType || "IELTS"}) exceeds requirement (${englishReq})`);
        } else if (engDiff >= 0) {
          matchReasons.push(`English score meets requirement (${englishReq})`);
        } else {
          matchReasons.push(`English score close to cutoff (${englishReq})`);
        }
      } else {
        englishPts = 18;
        matchReasons.push("Pathway / English waiver available");
      }

      // 3. Program & Field Score (up to 25 pts)
      let programPts = 18;
      if (matchingPrograms.length > 0) {
        const progBonus = Math.min(3, (matchingPrograms.length - 1) * 1.5);
        programPts = 22 + progBonus;
        matchReasons.push(`Offers exact program match for ${field || degreeLevel || "your choice"}`);
      } else if (field || degreeLevel) {
        programPts = 16;
        matchReasons.push(`Offers related degrees in ${field || "selected field"}`);
      } else {
        matchReasons.push("Multiple relevant study programs available");
      }

      // 4. University Specific Factors (Ranking & Acceptance Rate variance up to +10 pts)
      // Ranking factor: top 100 = +5.0, top 500 = +4.0, top 2000 = +2.5, top 10000 = +1.0
      const rankPts = rank ? Math.max(0.5, 5 - Math.log10(Math.max(1, rank)) * 1.2) : 2.5;

      // Acceptance rate factor: higher acceptance gives slight accessibility boost (+1 to +3 pts)
      const acceptancePts = (admissionRate / 100) * 3;

      // 5. Country & Financial Affordability Score (up to 15 pts)
      let locBudgetPts = 8;
      if (selectedCountries.length > 0 && selectedCountries.includes(schoolCountry)) {
        locBudgetPts += 4;
      }
      if (budget > 0) {
        if (tuitionFee <= budget) {
          locBudgetPts += 3;
          matchReasons.push(`Tuition ($${tuitionFee.toLocaleString()}) within your budget`);
        } else if (tuitionFee <= budget * 1.2) {
          locBudgetPts += 1;
        }
      } else {
        // Affordability factor based on tuition fee (lower tuition gets small boost)
        const tuitionFactor = Math.max(0, (30000 - tuitionFee) / 10000);
        locBudgetPts += Math.min(3, Math.max(0, tuitionFactor));
      }

      // Calculate total raw score and apply deterministic hash based on school ID for slight unique tie-breaking
      const schoolIdHash = (String(school.school_id).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5) - 2;
      const rawScore = gpaPts + englishPts + programPts + rankPts + acceptancePts + locBudgetPts + (schoolIdHash * 0.4);

      // Clamp score to clean 58 - 98% range
      const matchScore = Math.min(98, Math.max(58, Math.round(rawScore)));

      return {
        id: String(school.school_id),
        name: school.name,
        location: school.city ? `${school.city}, ${school.province || ""}` : (school.country || ""),
        countryCode: schoolCountry,
        tuitionFee,
        feeBand: tuitionFee > 30000 ? "high" : tuitionFee > 15000 ? "medium" : "low",
        englishReq,
        admissionRate,
        gpaRequirement: normalizedGpaReq,
        internationalPercentage:
          school.number_of_international_students && school.total_number_of_students
            ? Math.round((school.number_of_international_students / school.total_number_of_students) * 100)
            : 22,
        salaryMedian: rank < 100 ? 75000 : rank < 300 ? 60000 : 48000,
        durationYears:
          primaryProgram?.length_breakdown?.includes("1")
            ? 1
            : primaryProgram?.length_breakdown?.includes("2")
            ? 2
            : 4,
        applicationDeadline: intake && intakeYear ? `${intake} ${intakeYear}` : "30 June 2026",
        rankingWorld: rank,
        rankingNational: rank > 100 ? Math.round(rank / 10) : 5,
        founded: school.founded_in || 1967,
        studentPopulation: school.total_number_of_students || 20000,
        type: school.institution_type || "Public",
        logo: school.logo?.url || school.logo?.url_thumbnail || "",
        banner: school.banner?.url || (school.photos && school.photos[0]?.url) || "/uni-default.webp",
        website: school.website || "",
        popularPrograms:
          displayPrograms.length > 0
            ? displayPrograms
            : [cleanProgramTitle(program, field, degreeLevel)],
        matchType: matchScore >= 85 ? "exact" : "recommended",
        matchScore,
        matchReasons,
        description: school.about
          ? school.about.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
          : `${school.name} offers top-tier academic courses.`,
      };
    });

    // 2. Combine, Deduplicate & Sort descending by matchScore
    const seenNames = new Set<string>();
    const matches: any[] = [];

    for (const match of matchedSchoolsList) {
      if (!match) continue;
      const normName = match.name.toLowerCase().trim();
      if (!seenNames.has(normName)) {
        seenNames.add(normName);
        matches.push(match);
      }
    }

    // Sort by Match Score descending (best matches first)
    matches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Match Search Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch university matches.", detail: String(error) },
      { status: 500 }
    );
  }
}
