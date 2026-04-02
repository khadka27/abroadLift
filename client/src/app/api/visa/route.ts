import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";

// Helper function to calculate visa success rate
function calculateVisaRate(data: {
  fundsAvailable: number;
  pastRejections: number;
  degreeLevel: string;
  destination: string;
}) {
  let rate = 70; // Base rate

  // Funds factor
  if (data.fundsAvailable >= 50000) rate += 15;
  else if (data.fundsAvailable >= 30000) rate += 5;
  else if (data.fundsAvailable < 15000) rate -= 20;

  // Rejections factor
  if (data.pastRejections === 1) rate -= 15;
  else if (data.pastRejections >= 2) rate -= 40;

  // Destination risk (Sample)
  const highRisk = ["USA", "CA", "AU"];
  const lowRisk = ["NL", "CH"];
  if (highRisk.includes(data.destination.toUpperCase())) rate -= 5;
  else if (lowRisk.includes(data.destination.toUpperCase())) rate += 5;

  // Degree Level
  if (["Masters", "PhD", "Postgraduate"].includes(data.degreeLevel)) rate += 10;
  else if (data.degreeLevel === "Bachelors") rate += 5;
  else rate -= 10;

  // Clamp results
  return Math.min(95, Math.max(10, rate));
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checks = await prisma.visaRateCheck.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(checks);
  } catch (error) {
    console.error("GET Visa Checks Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { nationality, destination, degreeLevel, fundsAvailable, ieltsScore, pastRejections } = body;

    const successRate = calculateVisaRate({
      fundsAvailable,
      pastRejections,
      degreeLevel,
      destination
    });

    const newCheck = await prisma.visaRateCheck.create({
      data: {
        userId,
        nationality,
        destination,
        degreeLevel,
        fundsAvailable,
        ieltsScore,
        pastRejections,
        successRate,
      },
    });

    return NextResponse.json(newCheck);
  } catch (error) {
    console.error("POST Visa Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, nationality, destination, degreeLevel, fundsAvailable, ieltsScore, pastRejections } = body;

    const successRate = calculateVisaRate({
      fundsAvailable,
      pastRejections,
      degreeLevel,
      destination
    });

    const updatedCheck = await prisma.visaRateCheck.update({
      where: { id, userId },
      data: {
        nationality,
        destination,
        degreeLevel,
        fundsAvailable,
        ieltsScore,
        pastRejections,
        successRate,
      },
    });

    return NextResponse.json(updatedCheck);
  } catch (error) {
    console.error("PUT Visa Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
