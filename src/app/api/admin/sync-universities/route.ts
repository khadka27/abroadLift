/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// API to sync universities from external sources (e.g. WorqNow)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Ensure this route is strictly for ADMIN users
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized. Admin access required.", {
        status: 401,
      });
    }

    const WORQNOW_API_KEY = process.env.WORQNOW_API_KEY;

    // Fetch data from external API
    // We expect the third-party API base format to look like the specified fetch
    const response = await fetch(
      "https://api.worqnow.ai/education/ca/universities",
      {
        headers: {
          Authorization: `Bearer ${WORQNOW_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Third-party API failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Extract items depending on the API structure (some return array, some return { data: [...] })
    const items = Array.isArray(data)
      ? data
      : data.universities || data.data || [];

    let count = 0;

    // Process and upsert into the database safely
    for (const item of items) {
      const uName = item.name || item.institutionName || item.university;

      if (!uName) continue; // Skip invalid records

      // Basic fallback parsing matching the GlobalPath Prisma Schema
      const uCountry = item.country || "Canada";
      const uCity = item.city || item.location || "Unknown";
      const uRanking = item.ranking ? parseInt(item.ranking) : null;
      const uTuition = item.tuitionFee ? parseFloat(item.tuitionFee) : 25000;
      const uCurrency = item.currency || "CAD";
      const uLivingCost = item.avgLivingCost
        ? parseFloat(item.avgLivingCost)
        : 12000;
      const uIelts =
        item.ieltsScore || item.ielts_score_required
          ? parseFloat(item.ieltsScore || item.ielts_score_required)
          : 6.5;
      const uDegreeLevel = item.level ? item.level.toUpperCase() : "BACHELOR";
      const uFieldCategory = item.discipline || item.category || "General";
      const uWebsite = item.website || item.url || null;

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
      message: `Successfully synchronized ${count} new universities into the platform.`,
    });
  } catch (error: any) {
    console.error("[SYNC_Universities_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
