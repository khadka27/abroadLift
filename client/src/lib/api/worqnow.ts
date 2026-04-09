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

const BASE_URL =
  process.env.WORQNOW_BASE_URL || "https://api.worqnow.ai/education";

/** Realistic annual international tuition ranges in USD by fee band */
const FEE_BAND_USD_RANGE: Record<string, { min: number; max: number }> = {
  low: { min: 7_500, max: 14_500 },
  medium: { min: 13_000, max: 25_000 },
  high: { min: 23_000, max: 42_000 },
  very_high: { min: 38_000, max: 68_000 },
};

const COUNTRY_FEE_MULTIPLIER: Record<string, number> = {
  usa: 1.2,
  us: 1.2,
  uk: 1.1,
  gb: 1.1,
  au: 1.0,
  australia: 1.0,
  ca: 0.95,
  canada: 0.95,
  de: 0.7,
  germany: 0.7,
  jp: 0.95,
  japan: 0.95,
  kr: 0.85,
  korea: 0.85,
  korean: 0.85,
  "south korea": 0.85,
  "republic of korea": 0.85,
  ie: 1.0,
  ireland: 1.0,
  nl: 0.95,
  netherlands: 0.95,
};

const COUNTRY_ALIAS_TO_API_CODE: Record<string, string> = {
  US: "usa",
  USA: "usa",
  "UNITED STATES": "usa",
  "UNITED STATES OF AMERICA": "usa",
  UK: "uk",
  GB: "uk",
  "UNITED KINGDOM": "uk",
  CA: "ca",
  CANADA: "ca",
  AU: "au",
  AUSTRALIA: "au",
  DE: "de",
  GERMANY: "de",
  JP: "jp",
  JAPAN: "jp",
  KR: "kr",
  KOREA: "kr",
  KOREAN: "kr",
  "SOUTH KOREA": "kr",
  "REPUBLIC OF KOREA": "kr",
  IE: "ie",
  IRELAND: "ie",
  NL: "nl",
  NETHERLANDS: "nl",
};

export function normalizeCountryCodeForWorqnow(countryCode: string): string {
  const key = String(countryCode || "")
    .trim()
    .toUpperCase();
  if (!key) return "";
  return COUNTRY_ALIAS_TO_API_CODE[key] || key.toLowerCase();
}

function seededInt(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const span = max - min + 1;
  return min + (hash % span);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function estimateTuitionUsd(u: any, countryCode: string): number {
  const band = String(u?.international_fee_band || "medium").toLowerCase();
  const range = FEE_BAND_USD_RANGE[band] || FEE_BAND_USD_RANGE.medium;
  const seed = `${u?.code || u?.name || "uni"}-${countryCode}-${band}`;

  // deterministic base within the fee-band range
  const base = seededInt(seed, range.min, range.max);

  // country-level correction so destinations have realistic spread
  const countryKey = String(countryCode || "").toLowerCase();
  const countryMultiplier = COUNTRY_FEE_MULTIPLIER[countryKey] ?? 1;

  // higher-ranked schools are typically more expensive
  const rankWorld = Number(u?.ranking_world);
  const rankPremium = Number.isFinite(rankWorld)
    ? rankWorld <= 100
      ? 1.22
      : rankWorld <= 300
        ? 1.14
        : rankWorld <= 700
          ? 1.06
          : 1
    : 1;

  // small deterministic jitter avoids repeated identical fees
  const jitter = seededInt(`${seed}-jitter`, -1500, 1800);

  const estimated = Math.round(base * countryMultiplier * rankPremium + jitter);
  return clamp(estimated, 6_000, 85_000);
}

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
  const code = normalizeCountryCodeForWorqnow(countryCode);
  if (!code) return [];

  if (universityCache[code]) {
    return universityCache[code];
  }

  const apiKey = process.env.WORQNOW_API_KEY;

  const url = `${BASE_URL}/${code}/universities`;

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

  // Enrich each university with a realistic numeric fee estimate
  const transformed = list.map((u: any) => ({
    ...u,
    estimatedFeeUSD: estimateTuitionUsd(u, code),
  }));

  universityCache[code] = transformed;
  return transformed;
}
