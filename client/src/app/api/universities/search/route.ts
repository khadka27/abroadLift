import { NextRequest, NextResponse } from "next/server";
import { fetchWorqnowUniversities } from "@/lib/api/worqnow";
import {
  REAL_ACCEPTANCE_RATES,
  estimateAcceptanceRate,
} from "@/lib/data/universityMetaData";
import { fetchHipolabsUniversities } from "@/lib/api/hipolabs";

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
};

function normalizeCountryCode(country: string): string {
  const key = (country || "").trim().toUpperCase();
  if (!key) return "";
  return COUNTRY_ALIAS_TO_CODE[key] || key;
}

const DEFAULT_COUNTRIES = process.env.POPULAR_STUDY_COUNTRIES || "DE,JP,KR";

interface SearchResult {
  id: string | number;
  name: string;
  location: string;
  tuition: string | number;
  acceptanceRate: number;
  website: string;
  country: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const countriesParam = searchParams.get("countries") || DEFAULT_COUNTRIES;
  const selectedCountries = countriesParam
    .split(",")
    .map((c) => normalizeCountryCode(c))
    .filter(Boolean);

  try {
    const resultsMap = new Map<string | number, SearchResult>();

    // We use Promise.all to fetch from all selected countries in parallel
    await Promise.all(
      selectedCountries.map(async (country) => {
        try {
          const [worqAll, hipolabsAll] = await Promise.all([
            fetchWorqnowUniversities(country),
            fetchHipolabsUniversities(country),
          ]);

          const worqFiltered = worqAll
            .filter((u) => u.name?.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 15)
            .map((u) => {
              let rate = REAL_ACCEPTANCE_RATES[u.name];
              if (!rate) {
                rate = estimateAcceptanceRate(u.ranking_world);
              }

              return {
                id: u.code || u.name,
                name: u.name,
                location: u.city || country,
                tuition: u.estimatedFeeUSD || "Check Website",
                acceptanceRate: rate,
                website: u.website || "",
                country: country,
              };
            });

          const hipolabsFiltered = hipolabsAll
            .filter((u) => u.name?.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 12)
            .map((u) => {
              const rate = estimateAcceptanceRate();
              return {
                id: `hipolabs-${country}-${u.name}`,
                name: u.name,
                location: u["state-province"] || u.country || country,
                tuition: "Check Website",
                acceptanceRate: rate,
                website: Array.isArray(u.web_pages) ? u.web_pages[0] : "",
                country: country,
              };
            });

          [...worqFiltered, ...hipolabsFiltered].forEach((res) =>
            resultsMap.set(`${res.country}-${res.name}`, res),
          );
        } catch (err) {
          console.error(`Error fetching results for ${country}:`, err);
        }
      }),
    );

    const results = Array.from(resultsMap.values());
    return NextResponse.json({ results });
  } catch (err: unknown) {
    console.error("Search API Error:", err);
    return NextResponse.json(
      { error: "Failed to search universities" },
      { status: 500 },
    );
  }
}
