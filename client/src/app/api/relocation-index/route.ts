/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = (searchParams.get("countryCode") || "US").toLowerCase();

  try {
    const url = process.env.WHERENEXT_RELOCATION_URL || "https://getwherenext.com/api/data/relocation-index";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch from WhereNext Relocation API");
    
    const json = await res.json();
    const data = json.data || [];
    
    const countryData = data.find((d: any) => d.country_code?.toLowerCase() === countryCode);
    
    if (countryData) {
      return NextResponse.json(countryData);
    }

    return NextResponse.json({ error: "Country relocation data not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
