/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * US Department of Education College Scorecard API Client
 * Docs: https://collegescorecard.ed.gov/data/documentation/
 */

const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1";

interface CollegeScorecardParams {
  "school.name"?: string;
  "school.state"?: string;
  "school.city"?: string;
  fields?: string; // Comma-separated list of fields (e.g., "id,school.name")
  page?: number; // Default 0
  per_page?: number; // Default 20, Max 100
  sort?: string; // e.g., "latest.student.size:desc"
  zip?: string;
  distance?: string; // e.g., "10mi" or "20km"
  all_programs_nested?: boolean;
  [key: string]: any; // Allow arbitrary fields and filters (e.g. `latest.cost.tuition.in_state__range=0..10000`)
}

export interface CollegeScorecardResponse<T = any> {
  metadata: {
    total: number;
    page: number;
    per_page: number;
  };
  results: T[];
}

export async function fetchSchools(
  params: CollegeScorecardParams,
): Promise<CollegeScorecardResponse> {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing College Scorecard API Key in environment variables.",
    );
  }

  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.append("api_key", apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  }

  // The College Scorecard API expects unencoded colons and commas in its query parameters.
  // URLSearchParams automatically encodes them (e.g., ':' to '%3A', ',' to '%2C').
  // We selectively decode only these characters to prevent 500 errors while preserving others like '&'.
  const queryString = queryParams.toString()
    .replace(/%3A/g, ":")
    .replace(/%2C/g, ",");
  
  const url = `${BASE_URL}/schools?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `College Scorecard API Error: ${response.status} - ${
        errorData?.error?.message || response.statusText
      }`,
    );
  }

  return response.json();
}
