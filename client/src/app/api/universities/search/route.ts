import { NextRequest, NextResponse } from "next/server";
import { getAllSchoolsCached } from "@/lib/api/cache";

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
    // Fetch all schools from the cached multipage data
    const schools = await getAllSchoolsCached();

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

      return {
        id: school.school_id,
        name: school.name,
        location: school.city ? `${school.city}, ${school.province || ""}` : (school.country || "Canada"),
        tuition: "Varies by Course",
        acceptanceRate,
        website: school.website || "",
        country: school.country || "Canada",
        logo: school.logo?.url || school.logo?.url_thumbnail || "",
        image: school.banner?.url || (school.photos && school.photos[0]?.url) || "/uni-default.webp",
        rankingWorld: rank
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

