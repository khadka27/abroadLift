import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.worqnow.ai/education";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = (searchParams.get("countryCode") || "usa").toLowerCase();
  const apiKey = process.env.WORQNOW_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  try {
    const url = `${BASE_URL}/${countryCode}/visa-guidance`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
        console.error(`WorqNow Visa API Error: ${response.status} for ${countryCode}`);
        // Fallback for demo or if endpoint doesn't exist yet for some countries
        return NextResponse.json({ 
            steps: [
                { title: "Financial Documentation", description: "Standard proof of funds for 1 year." },
                { title: "IELTS/PTE Scans", description: "Certified copies of English proficiency." },
                { title: "Passport Application", description: "Valid for at least 6 months beyond stay." }
            ]
        });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Visa Guidance Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch visa guidance" }, { status: 500 });
  }
}
