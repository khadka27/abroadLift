/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * WorqNow Education API Client
 * Docs: https://api.worqnow.ai
 *
 * Real response shape:
 *   { count: number, data: University[], <country>_info: {...} }
 *
 * University fields (confirmed from live API):
 *   code, name, city, region, website, international_fee_band ("low" | "medium" | "high" | "very_high"),
 *   entry_paths, courses, scholarships, is_russell_group, ranking_world, ranking_national
 *
 * Note: There is NO numeric tuition field — fees are expressed as a band string.
 * We map the band to a numeric range for budget filtering.
 */

const BASE_URL = "https://api.worqnow.ai/education";

/** Approximate annual international tuition in USD by fee band */
const FEE_BAND_USD: Record<string, number> = {
  low: 8_000,
  medium: 16_000,
  high: 26_000,
  very_high: 45_000,
};

export interface WorqnowUniversity {
  id?: string;
  code: string;
  name: string;
  city?: string;
  region?: string;
  website?: string;
  international_fee_band?: string;
  /** Estimated annual fee in USD (derived from band) */
  estimatedFeeUSD?: number;
  ranking_world?: number;
  ranking_national?: number;
  courses?: { name: string; category: string; level: string[] }[];
  scholarships?: { name: string; value: string }[];
  is_russell_group?: boolean;
}

const universityCache: Record<string, WorqnowUniversity[]> = {};

export async function fetchWorqnowUniversities(
  countryCode: string,
): Promise<WorqnowUniversity[]> {
  const code = countryCode.toLowerCase();
  if (universityCache[code]) {
    return universityCache[code];
  }

  const apiKey = process.env.WORQNOW_API_KEY;

  const url = `${BASE_URL}/${countryCode.toLowerCase()}/universities`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  // Only attach auth header if a key is configured
  if (apiKey && apiKey !== "your_worqnow_api_key_here") {
    headers["Authorization"] = `Bearer ${apiKey}`;
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(url, { method: "GET", headers });

  if (!response.ok) {
    console.warn(`WorqNow API Error: ${response.status} for ${countryCode}`);
    return [];
  }

  const data = await response.json();

  // The live API returns { count, data: [...], <country>_info: {...} }
  const list: any[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  // Enrich each university with an estimated numeric fee
  const transformed = list.map((u: any) => ({
    ...u,
    estimatedFeeUSD: FEE_BAND_USD[u.international_fee_band] ?? 0,
  }));

  universityCache[code] = transformed;
  return transformed;
}
