/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAllSchoolsCached, getSchoolsCached, getProgramsCached } from "@/lib/api/cache";

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

  const hasCriteria = !!(degreeLevel || field || program || budget > 0);

  try {
    // 1. Fetch remote cached schools/programs
    const schools = await getAllSchoolsCached();
    const programs = hasCriteria ? await getProgramsCached() : [];

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

      // When no criteria, include all matching-country schools directly
      if (!hasCriteria) {
        const rank = school.school_rank || 500;
        const admissionRate = Math.min(95, Math.max(25, 98 - Math.round(Math.log10(rank + 1) * 15)));
        return {
          id: String(school.school_id),
          name: school.name,
          location: school.city ? `${school.city}, ${school.province || ""}` : (school.country || ""),
          countryCode: schoolCountry,
          tuitionFee: 18000,
          feeBand: "medium",
          englishReq: 6.5,
          admissionRate,
          gpaRequirement: 3.0,
          internationalPercentage: 22,
          salaryMedian: rank < 100 ? 75000 : rank < 300 ? 60000 : 48000,
          durationYears: 4,
          applicationDeadline: "30 June 2026",
          rankingWorld: rank,
          rankingNational: rank > 100 ? Math.round(rank / 10) : 5,
          founded: school.founded_in || 1967,
          studentPopulation: school.total_number_of_students || 20000,
          type: school.institution_type || "Public",
          logo: school.logo?.url || school.logo?.url_thumbnail || "",
          banner: school.banner?.url || (school.photos && school.photos[0]?.url) || "/uni-default.webp",
          website: school.website || "",
          popularPrograms: [],
          matchType: "recommended",
          description: school.about
            ? school.about.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
            : `${school.name} offers top-tier academic courses.`,
        };
      }

      // Filter programs by criteria
      const matchingPrograms = schoolPrograms.filter((prog: any) => {
        if (degreeLevel) {
          const dlLower = degreeLevel.toLowerCase();
          const pNameLower = prog.name?.toLowerCase() || "";
          const pLevelLower = prog.level?.toLowerCase() || "";
          const pLevelTextLower = prog.level_text?.toLowerCase() || "";

          let matchesLevel = false;
          if (dlLower.includes("bachelor") && (pNameLower.includes("bachelor") || pLevelLower.includes("bachelor") || pLevelTextLower.includes("bachelor"))) {
            matchesLevel = true;
          } else if (dlLower.includes("master") && (pNameLower.includes("master") || pLevelLower.includes("master") || pLevelTextLower.includes("master"))) {
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
          const pNameLower = prog.name?.toLowerCase() || "";
          const targetProgLower = program.toLowerCase();
          if (!pNameLower.includes(targetProgLower) && !targetProgLower.includes(pNameLower)) {
            return false;
          }
        }

        if (budget > 0) {
          const tuitionVal = parseFloat(String(prog.tuition || 0));
          if (tuitionVal > 0 && tuitionVal > budget) {
            return false;
          }
        }

        return true;
      });

      // If we have specific criteria but no matching programs, still include school
      // with a "similar" match type rather than returning null (better UX)
      const rank = school.school_rank || 500;
      const admissionRate = Math.min(95, Math.max(25, 98 - Math.round(Math.log10(rank + 1) * 15)));
      const primaryProgram = matchingPrograms[0] || schoolPrograms[0];
      const tuitionFee = primaryProgram?.tuition ? parseFloat(String(primaryProgram.tuition)) : 18000;
      const englishReq = primaryProgram?.requirements?.min_ielts_average
        ? parseFloat(String(primaryProgram.requirements.min_ielts_average))
        : 6.5;
      const gpaRequirement = primaryProgram?.requirements?.min_gpa
        ? parseFloat(String(primaryProgram.requirements.min_gpa))
        : 3.0;

      return {
        id: String(school.school_id),
        name: school.name,
        location: school.city ? `${school.city}, ${school.province || ""}` : (school.country || ""),
        countryCode: schoolCountry,
        tuitionFee,
        feeBand: tuitionFee > 30000 ? "high" : tuitionFee > 15000 ? "medium" : "low",
        englishReq,
        admissionRate,
        gpaRequirement,
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
        applicationDeadline: "30 June 2026",
        rankingWorld: rank,
        rankingNational: rank > 100 ? Math.round(rank / 10) : 5,
        founded: school.founded_in || 1967,
        studentPopulation: school.total_number_of_students || 20000,
        type: school.institution_type || "Public",
        logo: school.logo?.url || school.logo?.url_thumbnail || "",
        banner: school.banner?.url || (school.photos && school.photos[0]?.url) || "/uni-default.webp",
        website: school.website || "",
        popularPrograms:
          matchingPrograms.length > 0
            ? matchingPrograms.slice(0, 3).map((p: any) => p.name)
            : schoolPrograms.slice(0, 3).map((p: any) => p.name),
        matchType: matchingPrograms.length > 0 ? "exact" : "recommended",
        description: school.about
          ? school.about.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
          : `${school.name} offers top-tier academic courses.`,
      };
    });

    // 2. Combine and Deduplicate
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

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Match Search Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch university matches.", detail: String(error) },
      { status: 500 }
    );
  }
}
