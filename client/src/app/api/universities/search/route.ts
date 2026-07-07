import { NextRequest, NextResponse } from "next/server";
import { getAllSchoolsCached, getProgramsCached } from "@/lib/api/cache";

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
  "SOUTH KOREA": "KR",
  IE: "IE",
  IRELAND: "IE",
  NL: "NL",
  NETHERLANDS: "NL",
};

function normalizeCountryCode(country: string): string {
  const key = (country || "").trim().toUpperCase();
  if (!key) return "";
  return COUNTRY_ALIAS_TO_CODE[key] || key;
}

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
  } else if (cip.startsWith("50") || cipPrefix === "54" || cipPrefix === "16" || cipPrefix === "23" || cipPrefix === "38" || n.includes("art") || n.includes("humanities") || n.includes("history") || n.includes("music") || n.includes("english")) {
    return "Arts & Humanities";
  } else {
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
    }
  }
  return "Liberal Arts & General";
}

const DEFAULT_COUNTRIES = process.env.POPULAR_STUDY_COUNTRIES || "CA,US";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const countriesParam = searchParams.get("countries") || DEFAULT_COUNTRIES;
  
  const selectedCountries = countriesParam
    .split(",")
    .map((c) => normalizeCountryCode(c))
    .filter(Boolean);

  try {
    // Fetch all schools and programs from cached multipage data
    const [schools, programs] = await Promise.all([
      getAllSchoolsCached(),
      getProgramsCached().catch(() => [])
    ]);

    // Map programs by school_id
    const programsBySchool = new Map<number, any[]>();
    for (const prog of programs) {
      const sId = prog.school_id;
      if (!programsBySchool.has(sId)) {
        programsBySchool.set(sId, []);
      }
      programsBySchool.get(sId)!.push(prog);
    }

    // Filter by selected countries and search query q in memory
    const filteredSchools = schools.filter((school) => {
      // 1. Filter by country code
      if (selectedCountries.length > 0) {
        const schoolCountryCode = normalizeCountryCode(school.country_code || school.country || "");
        if (!selectedCountries.includes(schoolCountryCode)) {
          return false;
        }
      }
      
      // 2. Filter by search query q
      if (q) {
        const name = (school.name || "").toLowerCase();
        if (!name.includes(q)) {
          return false;
        }
      }

      return true;
    });

    const results = filteredSchools.map((school) => {
      const rank = school.school_rank || 500;
      const acceptanceRate = Math.min(95, Math.max(25, 98 - Math.round(Math.log10(rank + 1) * 15)));
      
      const schoolPrograms = programsBySchool.get(school.school_id) || [];
      
      // Extract unique majors (fieldCategories) offered by this school
      const majors = Array.from(new Set(schoolPrograms.map(getProgramField)));
      
      // Calculate a realistic average tuition fee based on programs
      const tuitions = schoolPrograms
        .map((p) => parseFloat(String(p.tuition || 0)))
        .filter((t) => t > 0);
      const avgTuition = tuitions.length > 0 
        ? Math.round(tuitions.reduce((a, b) => a + b, 0) / tuitions.length)
        : 18000;

      return {
        id: school.school_id,
        name: school.name,
        location: school.city ? `${school.city}, ${school.province || ""}` : (school.country || "Canada"),
        tuition: avgTuition > 0 ? `$${avgTuition.toLocaleString()}/yr` : "Varies by Course",
        tuitionValue: avgTuition,
        acceptanceRate,
        website: school.website || "",
        country: school.country || "Canada",
        logo: school.logo?.url || school.logo?.url_thumbnail || "",
        image: school.banner?.url || (school.photos && school.photos[0]?.url) || "/uni-default.webp",
        rankingWorld: rank,
        majors
      };
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to search universities", detail: error.message },
      { status: 500 }
    );
  }
}
