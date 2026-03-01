import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateMatchEligibility } from "@/lib/matching";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    const universities = await prisma.university.findMany({
      where: {
        country: profile.preferredCountry || undefined,
        degreeLevel: profile.degreeLevel || undefined,
      },
    });

    const matches = universities.map((university) => {
      return {
        ...university,
        eligibility: calculateMatchEligibility(profile, university),
      };
    });

    matches.sort((a, b) => {
      const rank = { ELIGIBLE: 1, PARTIALLY_ELIGIBLE: 2, NOT_ELIGIBLE: 3 };
      return rank[a.eligibility] - rank[b.eligibility];
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("[MATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
