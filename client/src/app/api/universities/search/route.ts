import { NextRequest, NextResponse } from "next/server";
import { fetchWorqnowUniversities } from "@/lib/api/worqnow";
import { REAL_ACCEPTANCE_RATES, estimateAcceptanceRate } from "@/lib/data/universityMetaData";

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
  const countriesParam = searchParams.get("countries") || "USA";
  const selectedCountries = countriesParam.split(",").map(c => c.trim().toUpperCase());

  try {
    const resultsMap = new Map<string | number, SearchResult>();

    // We use Promise.all to fetch from all selected countries in parallel
    await Promise.all(selectedCountries.map(async (country) => {
      try {
        const all = await fetchWorqnowUniversities(country);
        const filtered = all
          .filter(u => u.name?.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 15)
          .map(u => {
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
              country: country
            };
          });

        filtered.forEach(res => resultsMap.set(res.id, res));
      } catch (err) {
        console.error(`Error fetching results for ${country}:`, err);
      }
    }));

    const results = Array.from(resultsMap.values());
    return NextResponse.json({ results });
  } catch (err: unknown) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Failed to search universities" }, { status: 500 });
  }
}
