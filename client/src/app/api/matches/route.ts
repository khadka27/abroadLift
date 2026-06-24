/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSchoolsCached, getProgramsCached } from "@/lib/api/cache";


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

const DEFAULT_COUNTRIES = process.env.POPULAR_STUDY_COUNTRIES || "DE,JP,KR";

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

  const hasCriteria = !!(degreeLevel || field || budget > 0);

  try {
    // Use shared globalThis cache — survives Next.js hot reloads, prevents 429
    const schools = await getSchoolsCached();
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
          id: school.school_id,
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
          const fLower = field.toLowerCase();
          const pNameLower = prog.name?.toLowerCase() || "";
          const pDescLower = prog.description?.toLowerCase() || "";

          let matchesField = false;
          if (fLower.includes("computer") && (pNameLower.includes("computer") || pNameLower.includes("software") || pNameLower.includes("it") || pNameLower.includes("information technology") || pNameLower.includes("cybersecurity"))) {
            matchesField = true;
          } else if (fLower.includes("business") && (pNameLower.includes("business") || pNameLower.includes("management") || pNameLower.includes("mba") || pNameLower.includes("finance") || pNameLower.includes("marketing") || pNameLower.includes("commerce"))) {
            matchesField = true;
          } else if (fLower.includes("health") && (pNameLower.includes("health") || pNameLower.includes("nursing") || pNameLower.includes("medicine") || pNameLower.includes("pharmacy") || pNameLower.includes("medical"))) {
            matchesField = true;
          } else if (fLower.includes("liberal") && (pNameLower.includes("liberal") || pNameLower.includes("general") || pNameLower.includes("arts") || pNameLower.includes("humanities"))) {
            matchesField = true;
          } else if (fLower.includes("engineering") && (pNameLower.includes("engineer") || pNameLower.includes("mechanical") || pNameLower.includes("civil") || pNameLower.includes("electrical"))) {
            matchesField = true;
          } else if (fLower.includes("data") && (pNameLower.includes("data") || pNameLower.includes("analytics") || pNameLower.includes("artificial intelligence") || pNameLower.includes("machine learning"))) {
            matchesField = true;
          } else if (pNameLower.includes(fLower) || pDescLower.includes(fLower)) {
            matchesField = true;
          }

          if (!matchesField) return false;
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
        id: school.school_id,
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

    const matches = matchedSchoolsList.filter(Boolean);
    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Match Search Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch university matches.", detail: String(error) },
      { status: 500 }
    );
  }
}
