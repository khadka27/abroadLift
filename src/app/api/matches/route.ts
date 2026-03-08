/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchSchools } from "@/lib/api/collegeScorecard";
import { fetchWorqnowUniversities } from "@/lib/api/worqnow";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "USA";
  const budget = parseFloat(searchParams.get("budget") || "0");
  const englishScore = parseFloat(searchParams.get("englishScore") || "0");
  const degreeLevel = searchParams.get("degreeLevel") || "";
  const field = searchParams.get("field") || "";

  try {
    let matches: any[] = [];

    /* ─────────────────────────────────────────────
       USA — College Scorecard (official gov API)
    ───────────────────────────────────────────── */
    if (country === "USA" || country === "US") {
      const response = await fetchSchools({
        "school.degrees_awarded.predominant": "3",
        sort: "latest.student.size:desc",
        fields:
          "id,school.name,school.city,school.state,school.school_url," +
          "latest.cost.tuition.in_state,latest.admissions.admission_rate.overall",
        per_page: 50,
      });

      const allResults = response.results ?? [];

      // Pass 1: Strict Match
      matches = allResults
        .filter((school: any) => {
          const tuition = school["latest.cost.tuition.in_state"];
          if (budget > 0 && tuition && tuition > budget) return false;
          if (englishScore > 0 && englishScore < 6.0) return false;
          return true;
        })
        .map((school: any) => ({
          id: school.id,
          name: school["school.name"],
          location: `${school["school.city"]}, ${school["school.state"]}`,
          tuitionFee: school["latest.cost.tuition.in_state"],
          feeBand: null,
          englishReq: 6.0,
          admissionRate: Math.round(
            (school["latest.admissions.admission_rate.overall"] || 0) * 100,
          ),
          scholarships: [],
          website: school["school.school_url"]
            ? school["school.school_url"].startsWith("http")
              ? school["school.school_url"]
              : `https://${school["school.school_url"]}`
            : null,
          matchType: "exact",
        }));

      // Fallback: If no strict matches, take the top schools but flag as 'similar'
      if (matches.length === 0 && allResults.length > 0) {
        matches = allResults.slice(0, 10).map((school: any) => ({
          id: school.id,
          name: school["school.name"],
          location: `${school["school.city"]}, ${school["school.state"]}`,
          tuitionFee: school["latest.cost.tuition.in_state"],
          englishReq: 6.0,
          admissionRate: Math.round(
            (school["latest.admissions.admission_rate.overall"] || 0) * 100,
          ),
          website: school["school.school_url"],
          matchType: "similar",
        }));
      }

      /* ─────────────────────────────────────────────
       All other countries — WorqNow Education API
    ───────────────────────────────────────────── */
    } else {
      const results = await fetchWorqnowUniversities(country);

      // Pass 1: Strict Match (Degree Level + Field + Budget)
      const exactMatches = results
        .filter((school) => {
          const fee = school.estimatedFeeUSD ?? 0;
          if (budget > 0 && fee > 0 && fee > budget) return false;

          // Check for degree level (Soft check: if no courses data, we assume they might offer it)
          if (degreeLevel && school.courses?.length) {
            const offersLevel = school.courses.some((c) =>
              c.level.includes(degreeLevel),
            );
            if (!offersLevel) return false;
          }

          if (field && school.courses?.length) {
            const offersField = school.courses.some(
              (c) =>
                c.category.toLowerCase().includes(field.toLowerCase()) ||
                c.name.toLowerCase().includes(field.toLowerCase()),
            );
            if (!offersField) return false;
          }
          return true;
        })
        .map((school) => ({
          id: school.code || school.name,
          name: school.name,
          location: school.city
            ? `${school.city}${school.region ? `, ${school.region}` : ""}`
            : country,
          tuitionFee: school.estimatedFeeUSD,
          feeBand: school.international_fee_band,
          englishReq: 6.0,
          rankingWorld: school.ranking_world,
          scholarships: school.scholarships ?? [],
          website: school.website ?? null,
          matchType: "exact",
        }));

      // Pass 2: Recommendations (Ignore Field/Degree, allow slightly higher budget)
      const recommendations = results
        .filter((school) => {
          // Check if already in exact matches
          if (exactMatches.some((m) => m.id === (school.code || school.name)))
            return false;

          const fee = school.estimatedFeeUSD ?? 0;
          // Allow up to 30% budget overrun for recommended top-tier schools
          if (budget > 0 && fee > 0 && fee > budget * 1.3) return false;
          return true;
        })
        .map((school) => ({
          id: school.code || school.name,
          name: school.name,
          location: school.city || country,
          tuitionFee: school.estimatedFeeUSD,
          feeBand: school.international_fee_band,
          englishReq: 5.5,
          rankingWorld: school.ranking_world,
          website: school.website ?? null,
          matchType: "recommended",
        }));

      matches = [...exactMatches, ...recommendations].slice(0, 15);

      // Ultimate Fallback: If still nothing (e.g. budget too low), just show top schools
      if (matches.length === 0 && results.length > 0) {
        matches = results.slice(0, 5).map((school) => ({
          id: school.code || school.name,
          name: school.name,
          location: school.city || country,
          tuitionFee: school.estimatedFeeUSD,
          matchType: "similar",
        }));
      }
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
