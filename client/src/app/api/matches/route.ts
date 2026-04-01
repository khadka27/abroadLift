/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchWorqnowUniversities } from "@/lib/api/worqnow";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countriesParam = searchParams.get("countries") || searchParams.get("country") || "USA";
  const selectedCountries = countriesParam.split(",");
  const budget = parseFloat(searchParams.get("budget") || "0");
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
                  return c.level.some((l: string) => l?.toLowerCase()?.includes(degreeLevel.toLowerCase()));
                }
                return c.level?.toLowerCase()?.includes(degreeLevel.toLowerCase());
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
          .map((school: any) => ({
            id: school.code || school.name,
            name: school.name,
            location: school.city
              ? `${school.city}${school.region ? `, ${school.region}` : ""}`
              : trimmedCountry,
            countryCode: trimmedCountry,
            tuitionFee: school.estimatedFeeUSD,
            feeBand: school.international_fee_band,
            englishReq: 6.0,
            rankingWorld: school.ranking_world,
            rankingNational: school.ranking_national,
            studentPopulation: school.student_population || 15000,
            type: school.funding_type || (school.is_russell_group ? "Public Research (Russell Group)" : "Public Research University"),
            scholarships: school.scholarships ?? [],
            website: school.website ?? null,
            popularPrograms: school.courses?.slice(0, 3).map((c: any) => c.name) || [],
            matchType: "exact",
            description: school.description || `${school.name} is a leading institution in ${school.city || trimmedCountry}, recognized for its ${school.is_russell_group ? 'high research output and academic prestige.' : 'contribution to global education and student success.'}`,
          }));

        // Pass 2: Recommendations
        const recommendations = results
          .filter((school: any) => {
            if (exactMatches.some((m) => m.id === (school.code || school.name)))
              return false;

            const fee = school.estimatedFeeUSD ?? 0;
            if (budget > 0 && fee > 0 && fee > budget * 1.3) return false;
            return true;
          })
          .map((school: any) => ({
            id: school.code || school.name,
            name: school.name,
            location: school.city || trimmedCountry,
            countryCode: trimmedCountry,
            tuitionFee: school.estimatedFeeUSD,
            feeBand: school.international_fee_band,
            englishReq: 5.5,
            rankingWorld: school.ranking_world,
            rankingNational: school.ranking_national,
            studentPopulation: school.student_population || 12000,
            type: school.funding_type || "Public Research University",
            website: school.website ?? null,
            matchType: "recommended",
            description: school.description || `A highly recommended institution in ${trimmedCountry} for international students.`,
          }));

        countryMatches = [...exactMatches, ...recommendations].slice(0, 15);

        // Ultimate Fallback
        if (countryMatches.length === 0 && results.length > 0) {
          countryMatches = results.slice(0, 5).map((school: any) => ({
            id: school.code || school.name,
            name: school.name,
            location: school.city || trimmedCountry,
            countryCode: trimmedCountry,
            tuitionFee: school.estimatedFeeUSD,
            matchType: "similar",
            description: `A quality educational institution in ${trimmedCountry}.`,
          }));
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
