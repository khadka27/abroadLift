const BASE_URL =
  process.env.HIPOLABS_API_URL || "http://universities.hipolabs.com/search";

const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  US: "United States",
  USA: "United States",
  UK: "United Kingdom",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  GERMANY: "Germany",
  JP: "Japan",
  JAPAN: "Japan",
  KR: "Korea, Republic of",
  KOREA: "Korea, Republic of",
  KOREAN: "Korea, Republic of",
  "SOUTH KOREA": "Korea, Republic of",
  "REPUBLIC OF KOREA": "Korea, Republic of",
  IE: "Ireland",
  NL: "Netherlands",
};

export interface HipolabsUniversity {
  name: string;
  country: string;
  alpha_two_code?: string;
  "state-province"?: string | null;
  domains?: string[];
  web_pages?: string[];
}

export function normalizeCountryForHipolabs(country: string): string {
  const trimmed = (country || "").trim();
  if (!trimmed) return "";

  const key = trimmed.toUpperCase();
  return COUNTRY_CODE_TO_NAME[key] || trimmed;
}

export async function fetchHipolabsUniversities(
  country: string,
): Promise<HipolabsUniversity[]> {
  const normalizedCountry = normalizeCountryForHipolabs(country);
  if (!normalizedCountry) return [];

  const url = `${BASE_URL}?country=${encodeURIComponent(normalizedCountry)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    console.warn(
      `Hipolabs API Error: ${response.status} for ${normalizedCountry}`,
    );
    return [];
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data as HipolabsUniversity[];
}
