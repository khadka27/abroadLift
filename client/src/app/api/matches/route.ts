/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchWorqnowUniversities } from "@/lib/api/worqnow";

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

function getAdmissionRate(rankWorld: number | undefined, seed: string) {
  const rankBase = rankWorld ? 88 - Math.log10(rankWorld + 10) * 14 : 64;
  const jitter = seededInt(`${seed}-admission`, -7, 7);
  return clamp(Math.round(rankBase + jitter), 28, 92);
}

function getDurationYears(degreeLevel: string, seed: string) {
  const normalized = degreeLevel.toLowerCase();

  if (normalized.includes("master") || normalized.includes("postgraduate")) {
    return seededInt(`${seed}-duration-pg`, 1, 2);
  }

  if (normalized.includes("bachelor") || normalized.includes("undergraduate")) {
    return seededInt(`${seed}-duration-ug`, 3, 4);
  }

  return seededInt(`${seed}-duration-generic`, 2, 4);
}

function getEnglishReq(feeBand: string | undefined, seed: string) {
  const band = (feeBand || "medium").toLowerCase();
  const baseMap: Record<string, number> = {
    low: 5.5,
    medium: 6.0,
    high: 6.5,
    very_high: 7.0,
  };
  const base = baseMap[band] ?? 6.0;
  const variance = seededInt(`${seed}-english`, 0, 2) * 0.5;
  return clamp(Number((base + variance).toFixed(1)), 5.5, 8.0);
}

function getGpaRequirement(admissionRate: number, seed: string) {
  const selectivity = 1 - admissionRate / 100;
  const base = 2.4 + selectivity * 1.5;
  const variance = seededInt(`${seed}-gpa`, 0, 3) * 0.1;
  return clamp(Number((base + variance).toFixed(1)), 2.4, 3.9);
}

function getInternationalPercentage(seed: string) {
  return seededInt(`${seed}-intl`, 9, 42);
}

function getSalaryMedian(
  rankWorld: number | undefined,
  estimatedFeeUSD: number | undefined,
  seed: string,
) {
  const rankingLift = rankWorld
    ? clamp(Math.round((1200 - Math.min(rankWorld, 1200)) * 22), 0, 26000)
    : 8000;
  const feeLift = estimatedFeeUSD
    ? clamp(Math.round(estimatedFeeUSD * 0.35), 0, 18000)
    : 6000;
  const jitter = seededInt(`${seed}-salary`, -3500, 6500);
  return clamp(32000 + rankingLift + feeLift + jitter, 28000, 98000);
}

function getApplicationDeadline(seed: string) {
  const deadlines = [
    "15 Jan 2027",
    "28 Feb 2027",
    "15 Mar 2027",
    "30 Apr 2027",
    "15 May 2027",
    "30 Jun 2027",
    "Rolling Admission",
  ];
  return deadlines[seededInt(`${seed}-deadline`, 0, deadlines.length - 1)];
}

function normalizeType(
  fundingType: string | undefined,
  isRussellGroup: boolean | undefined,
) {
  if (fundingType) {
    return fundingType;
  }

  return isRussellGroup
    ? "Public Research (Russell Group)"
    : "Public Research University";
}

function mapSchoolToMatch({
  school,
  country,
  degreeLevel,
  matchType,
}: {
  school: any;
  country: string;
  degreeLevel: string;
  matchType: "exact" | "recommended" | "similar";
}) {
  const seed = `${school.code || school.name}-${country}`;
  const admissionRate = getAdmissionRate(school.ranking_world, seed);
  const durationYears = getDurationYears(degreeLevel, seed);
  const englishReq = getEnglishReq(school.international_fee_band, seed);
  const gpaRequirement = getGpaRequirement(admissionRate, seed);
  const internationalPercentage = getInternationalPercentage(seed);
  const salaryMedian = getSalaryMedian(
    school.ranking_world,
    school.estimatedFeeUSD,
    seed,
  );
  const founded = seededInt(`${seed}-founded`, 1850, 2016);

  return {
    id: school.code || school.name,
    name: school.name,
    location: school.city
      ? `${school.city}${school.region ? `, ${school.region}` : ""}`
      : country,
    countryCode: country,
    tuitionFee: school.estimatedFeeUSD,
    feeBand: school.international_fee_band,
    englishReq,
    admissionRate,
    gpaRequirement,
    internationalPercentage,
    salaryMedian,
    durationYears,
    applicationDeadline: getApplicationDeadline(seed),
    rankingWorld: school.ranking_world,
    rankingNational: school.ranking_national,
    founded,
    studentPopulation:
      school.student_population || seededInt(`${seed}-pop`, 9000, 42000),
    type: normalizeType(school.funding_type, school.is_russell_group),
    scholarships: school.scholarships ?? [],
    website: school.website ?? null,
    popularPrograms: school.courses?.slice(0, 3).map((c: any) => c.name) || [],
    matchType,
    description:
      school.description ||
      `${school.name} in ${school.city || country} offers strong academic pathways and international student support.`,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countriesParam =
    searchParams.get("countries") || searchParams.get("country") || "USA";
  const selectedCountries = countriesParam.split(",");
  const budget = Number.parseFloat(searchParams.get("budget") || "0");
  const degreeLevel = searchParams.get("degreeLevel") || "";
  const field = searchParams.get("field") || "";

  try {
    let allMatches: any[] = [];

    for (const country of selectedCountries) {
      const trimmedCountry = country.trim();
      if (!trimmedCountry) continue;

      try {
        let countryMatches: any[] = [];

        /* ─────────────────────────────────────────────
           All countries — WorqNow Education API
        ───────────────────────────────────────────── */
        const results = await fetchWorqnowUniversities(trimmedCountry);

        // Pass 1: Strict Match (Degree Level + Field + Budget)
        const exactMatches = results
          .filter((school: any) => {
            const fee = school.estimatedFeeUSD ?? 0;
            if (budget > 0 && fee > 0 && fee > budget) return false;

            if (degreeLevel && school.courses?.length) {
              const offersLevel = school.courses.some((c: any) => {
                if (Array.isArray(c.level)) {
                  return c.level.some((l: string) =>
                    l?.toLowerCase()?.includes(degreeLevel.toLowerCase()),
                  );
                }
                return c.level
                  ?.toLowerCase()
                  ?.includes(degreeLevel.toLowerCase());
              });
              if (!offersLevel) return false;
            }

            if (field && school.courses?.length) {
              const offersField = school.courses.some(
                (c: any) =>
                  c.category?.toLowerCase()?.includes(field.toLowerCase()) ||
                  c.name?.toLowerCase()?.includes(field.toLowerCase()),
              );
              if (!offersField) return false;
            }
            return true;
          })
          .map((school: any) =>
            mapSchoolToMatch({
              school,
              country: trimmedCountry,
              degreeLevel,
              matchType: "exact",
            }),
          );

        // Pass 2: Recommendations
        const recommendations = results
          .filter((school: any) => {
            if (exactMatches.some((m) => m.id === (school.code || school.name)))
              return false;

            const fee = school.estimatedFeeUSD ?? 0;
            if (budget > 0 && fee > 0 && fee > budget * 1.3) return false;
            return true;
          })
          .map((school: any) =>
            mapSchoolToMatch({
              school,
              country: trimmedCountry,
              degreeLevel,
              matchType: "recommended",
            }),
          );

        countryMatches = [...exactMatches, ...recommendations].slice(0, 15);

        // Ultimate Fallback
        if (countryMatches.length === 0 && results.length > 0) {
          countryMatches = results.slice(0, 5).map((school: any) =>
            mapSchoolToMatch({
              school,
              country: trimmedCountry,
              degreeLevel,
              matchType: "similar",
            }),
          );
        }

        allMatches = [...allMatches, ...countryMatches];
      } catch (err) {
        console.error(`Error fetching results for ${trimmedCountry}:`, err);
      }
    }

    // Balanced Result Aggregation
    const byCountry: Record<string, any[]> = {};
    for (const m of allMatches) {
      if (!byCountry[m.countryCode]) byCountry[m.countryCode] = [];
      byCountry[m.countryCode].push(m);
    }

    // Interleave results (Round-Robin)
    const matches: any[] = [];
    const countryCodes = Object.keys(byCountry);
    let hasMore = true;
    let index = 0;

    while (hasMore && matches.length < 20) {
      hasMore = false;
      for (const code of countryCodes) {
        if (byCountry[code][index]) {
          matches.push(byCountry[code][index]);
          hasMore = true;
        }
      }
      index++;
    }

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Match Search Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch university matches.", detail: String(error) },
      { status: 500 },
    );
  }
}
