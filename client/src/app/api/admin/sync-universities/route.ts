/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getAllSchoolsCached, getProgramsMultiPageCached } from "@/lib/api/cache";

// API to sync universities from AbroadLift API
export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    // Ensure this route is strictly for ADMIN users
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return new NextResponse("Unauthorized. Admin access required.", {
        status: 401,
      });
    }

    // Fetch schools and programs from cached AbroadLift API
    const [schools, programs] = await Promise.all([
      getAllSchoolsCached(),
      getProgramsMultiPageCached(10).catch(() => []),
    ]);

    // Map programs by school_id
    const programsBySchool = new Map<number, any[]>();
    for (const prog of programs) {
      const sId = prog.school_id;
      if (!programsBySchool.has(sId)) {
        programsBySchool.set(sId, []);
      }
      programsBySchool.get(sId)!.push(prog);
    }

    let count = 0;

    // Process and upsert into the database safely
    for (const school of schools) {
      const uName = school.name;
      if (!uName) continue; // Skip invalid records

      const uCountry = school.country || "Canada";
      const uCity = school.city || "Unknown";
      const uRanking = school.school_rank || null;
      const uWebsite = school.website || null;
      const uCurrency = school.currency || "USD";
      const uLivingCost = school.cost_of_living
        ? parseFloat(String(school.cost_of_living))
        : 12000;

      // Extract details from associated programs
      const schoolPrograms = programsBySchool.get(school.school_id) || [];

      // Calculate average tuition
      const tuitions = schoolPrograms
        .map((p) => parseFloat(String(p.tuition || 0)))
        .filter((t) => t > 0);
      const uTuition = tuitions.length > 0
        ? Math.round(tuitions.reduce((a, b) => a + b, 0) / tuitions.length)
        : 22000; // fallback

      // Calculate IELTS requirement
      const ieltsScores = schoolPrograms
        .map((p) => parseFloat(String(p.requirements?.min_ielts_average || 0)))
        .filter((score) => score > 0);
      const uIelts = ieltsScores.length > 0
        ? Math.min(...ieltsScores)
        : 6.5;

      // Extract unique degree levels
      const levels = Array.from(
        new Set(
          schoolPrograms
            .map((p) => p.level_text || p.level)
            .filter(Boolean)
        )
      );
      const uDegreeLevel = levels.length > 0
        ? levels.join(", ")
        : "Undergraduate, Postgraduate";

      // Extract unique fields / categories
      const fields = Array.from(
        new Set(
          schoolPrograms
            .map((p) => p.category || p.discipline)
            .filter(Boolean)
        )
      );
      const uFieldCategory = fields.length > 0
        ? fields.join(", ")
        : "General";

      // Verify duplicate existence by matching name and country
      const existing = await prisma.university.findFirst({
        where: {
          name: uName,
          country: uCountry,
        },
      });

      if (!existing) {
        await prisma.university.create({
          data: {
            name: uName,
            country: uCountry,
            city: uCity,
            ranking: uRanking,
            tuitionFee: uTuition,
            currency: uCurrency,
            avgLivingCost: uLivingCost,
            ieltsRequirement: uIelts,
            degreeLevel: uDegreeLevel,
            fieldCategory: uFieldCategory,
            website: uWebsite,
          },
        });
        count++;
      }
    }

    return NextResponse.json({
      success: true,
      count,
      message: `Successfully synchronized ${count} new universities into the platform from AbroadLift API.`,
    });
  } catch (error: any) {
    console.error("[SYNC_Universities_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

