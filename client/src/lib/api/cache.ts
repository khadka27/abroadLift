/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shared AbroadLift API Cache
 *
 * Uses globalThis to persist across Next.js hot-reloads in dev mode.
 * This prevents repeated API calls that trigger 429 rate-limiting.
 *
 * The AbroadLift API allows ~150 requests per 15 minutes.
 * By caching schools and programs in globalThis, all route handlers
 * share a single fetched copy for 30 minutes.
 */

const API_URL = process.env.ABROADLIFT_API_URL || "https://api.abroadlift.com";
const API_KEY = process.env.ABROADLIFT_API_KEY || "vl0i3A4W7DxG1fJohzI2qmbedgp4EAYT";

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// ─── Type-safe globalThis augmentation ───────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __abroadlift_cache: {
    schools?: { data: any[]; ts: number };
    allSchools?: { data: any[]; ts: number };
    programs?: { data: any[]; ts: number };
    allPrograms?: { data: any[]; ts: number };
    // In-flight dedup: if a fetch is in progress, store the promise
    schoolsFlight?: Promise<any[]>;
    allSchoolsFlight?: Promise<any[]>;
    programsFlight?: Promise<any[]>;
    allProgramsFlight?: Promise<any[]>;
  };
}

if (!globalThis.__abroadlift_cache) {
  globalThis.__abroadlift_cache = {};
}

const cache = globalThis.__abroadlift_cache;

// ─── Raw fetcher (bypasses the 10s timeout set in abroadlift.ts) ─────────────
async function rawFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15000), // 15s – enough for cold API responses
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Unknown error");
    throw new Error(`AbroadLift API Error (${res.status}): ${msg}`);
  }
  return res.json() as Promise<T>;
}

// ─── Schools ──────────────────────────────────────────────────────────────────
/**
 * Returns page-1 schools (limit=100). Cached for 30 min in globalThis.
 * Deduplicates concurrent requests so only one HTTP call fires at a time.
 */
export async function getSchoolsCached(): Promise<any[]> {
  const now = Date.now();

  // Cache hit
  if (cache.schools && now - cache.schools.ts < CACHE_TTL) {
    return cache.schools.data;
  }

  // In-flight dedup: if another request is already fetching, await it
  if (cache.schoolsFlight) {
    return cache.schoolsFlight;
  }

  // Kick off the fetch
  cache.schoolsFlight = (async () => {
    try {
      const res = await rawFetch<any>("/api/schools?page=1&limit=100");
      const data = res.data || [];
      cache.schools = { data, ts: Date.now() };
      return data;
    } finally {
      delete cache.schoolsFlight;
    }
  })();

  return cache.schoolsFlight;
}

/**
 * Returns ALL schools by paginating (up to 15 pages).
 * Used by the countries extraction endpoint. Cached separately.
 */
export async function getAllSchoolsCached(): Promise<any[]> {
  const now = Date.now();

  // Cache hit for ALL schools
  if (cache.allSchools && now - cache.allSchools.ts < CACHE_TTL) {
    return cache.allSchools.data;
  }

  if (cache.allSchoolsFlight) {
    return cache.allSchoolsFlight;
  }

  cache.allSchoolsFlight = (async () => {
    try {
      // Sequential page fetches to stay within rate limits
      const firstPage = await rawFetch<any>("/api/schools?page=1&limit=100");
      const totalPages = Math.min(firstPage.pagination?.totalPages || 1, 15);
      const schools: any[] = [...(firstPage.data || [])];

      for (let p = 2; p <= totalPages; p++) {
        try {
          const page = await rawFetch<any>(`/api/schools?page=${p}&limit=100`);
          if (page.data) schools.push(...page.data);
          // 200 ms pause between sequential pages to avoid 429
          await new Promise((r) => setTimeout(r, 250));
        } catch (err) {
          console.warn(`Skipping schools page ${p}:`, err);
          break; // stop on error to avoid cascading 429s
        }
      }

      cache.allSchools = { data: schools, ts: Date.now() };
      return schools;
    } finally {
      delete cache.allSchoolsFlight;
    }
  })();

  return cache.allSchoolsFlight;
}

// ─── Programs ─────────────────────────────────────────────────────────────────
/**
 * Returns page-1 programs (limit=100). Cached for 30 min in globalThis.
 * Deduplicates concurrent requests.
 */
export async function getProgramsCached(): Promise<any[]> {
  const now = Date.now();

  if (cache.programs && now - cache.programs.ts < CACHE_TTL) {
    return cache.programs.data;
  }

  if (cache.programsFlight) {
    return cache.programsFlight;
  }

  cache.programsFlight = (async () => {
    try {
      const res = await rawFetch<any>("/api/programs?page=1&limit=100");
      const data = res.data || [];
      cache.programs = { data, ts: Date.now() };
      return data;
    } finally {
      delete cache.programsFlight;
    }
  })();

  return cache.programsFlight;
}

/**
 * Returns programs across multiple pages (up to maxPages).
 * Used for study-level extraction. Sequential to avoid rate limits.
 */
export async function getProgramsMultiPageCached(maxPages = 5): Promise<any[]> {
  const now = Date.now();

  if (cache.allPrograms && now - cache.allPrograms.ts < CACHE_TTL) {
    return cache.allPrograms.data;
  }

  if (cache.allProgramsFlight) {
    return cache.allProgramsFlight;
  }

  cache.allProgramsFlight = (async () => {
    try {
      const firstPage = await rawFetch<any>("/api/programs?page=1&limit=100");
      const totalPages = Math.min(firstPage.pagination?.totalPages || 1, maxPages);
      const programs: any[] = [...(firstPage.data || [])];

      for (let p = 2; p <= totalPages; p++) {
        try {
          const page = await rawFetch<any>(`/api/programs?page=${p}&limit=100`);
          if (page.data) programs.push(...page.data);
          await new Promise((r) => setTimeout(r, 250));
        } catch (err) {
          console.warn(`Skipping programs page ${p}:`, err);
          break;
        }
      }

      cache.allPrograms = { data: programs, ts: Date.now() };
      return programs;
    } finally {
      delete cache.allProgramsFlight;
    }
  })();

  return cache.allProgramsFlight;
}

/**
 * Force-invalidates the cache (useful after a server restart or manual refresh)
 */
export function invalidateCache() {
  delete cache.schools;
  delete cache.allSchools;
  delete cache.programs;
  delete cache.allPrograms;
}
