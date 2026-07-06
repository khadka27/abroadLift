/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAllSchoolsCached, getSchoolsCached } from "@/lib/api/cache";
import { abroadliftApi } from "@/lib/api/abroadlift";

// ─── Country code normalization ───────────────────────────────────────────────
const CODE_NORMALIZE: Record<string, string> = {
  US: "USA", USA: "USA", "UNITED STATES": "USA",
  GB: "UK", UK: "UK", "UNITED KINGDOM": "UK",
  CA: "CA", CANADA: "CA",
  AU: "AU", AUSTRALIA: "AU",
  DE: "DE", GERMANY: "DE",
  JP: "JP", JAPAN: "JP",
  KR: "KR", "SOUTH KOREA": "KR", KOREA: "KR",
  IE: "IE", IRELAND: "IE",
  NL: "NL", NETHERLANDS: "NL",
  FR: "FR", FRANCE: "FR",
  IT: "IT", ITALY: "IT",
  ES: "ES", SPAIN: "ES",
  SE: "SE", SWEDEN: "SE",
  CH: "CH", SWITZERLAND: "CH",
  NZ: "NZ", "NEW ZEALAND": "NZ",
  SG: "SG", SINGAPORE: "SG",
  AE: "AE", UAE: "AE", "UNITED ARAB EMIRATES": "AE",
  MT: "MT", MALTA: "MT",
};

function normalizeCode(raw: string): string {
  const key = raw.trim().toUpperCase();
  return CODE_NORMALIZE[key] || key;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const allCountries = searchParams.get("allCountries") === "true";

  // ─── allCountries=true: extract unique countries from all schools ─────────
  if (allCountries) {
    try {
      // Use paginated cache (all pages) for country extraction
      const schools = await getAllSchoolsCached();

      const countriesMap = new Map<string, string>();
      schools.forEach((school: any) => {
        const codeRaw = (school.country_code || school.country || "").trim();
        const nameRaw = (school.country || "").trim();
        if (codeRaw && nameRaw) {
          const code = normalizeCode(codeRaw);
          if (!countriesMap.has(code)) {
            countriesMap.set(code, nameRaw);
          }
        }
      });

      const countriesList = Array.from(countriesMap.entries()).map(([code, name]) => ({
        code,
        name,
      }));

      return NextResponse.json({ success: true, data: countriesList });
    } catch (error: any) {
      console.error("Proxy Schools GET all countries error:", error);
      return NextResponse.json(
        { success: false, data: [], error: error.message || "Failed to fetch all countries" }
      );
    }
  }

  // ─── Default: page-based school list ────────────────────────────────────────
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || "";
  const countryCode = searchParams.get("country_code") || "";

  try {
    if (search || countryCode) {
      // Fetch matching schools directly from the AbroadLift API
      const data = await abroadliftApi.getSchools(page, limit, search, countryCode);
      return NextResponse.json(data);
    }

    if (page === 1) {
      // Serve page 1 from the fast single-page cache
      const data = await getSchoolsCached();
      return NextResponse.json({
        success: true,
        data,
        pagination: { page: 1, limit: 100, total: data.length, totalPages: 1 },
      });
    }

    // For other pages, use the all-schools cache (falls back to single-page if throttled)
    const allData = await getAllSchoolsCached();
    const start = (page - 1) * limit;
    const pageData = allData.slice(start, start + limit);
    return NextResponse.json({
      success: true,
      data: pageData,
      pagination: {
        page,
        limit,
        total: allData.length,
        totalPages: Math.ceil(allData.length / limit),
      },
    });
  } catch (error: any) {
    console.error("Proxy Schools GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch schools" },
      { status: 500 }
    );
  }
}
