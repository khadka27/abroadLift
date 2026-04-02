/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawCode = (searchParams.get("countryCode") || "US").toUpperCase();

  const normalization: Record<string, string> = {
    "USA": "US",
    "UK": "GB",
    "CAN": "CA",
    "AUS": "AU",
    "GER": "DE",
  };

  let targetCode = normalization[rawCode] || rawCode;

  try {
    const url = process.env.WHERENEXT_API_URL || "https://getwherenext.com/api/data/cost-of-living";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch from WhereNext API");
    
    const json = await res.json();
    const data = json.data || [];
    
    // Find precise country
    let countryData = data.find((d: any) => d.country_code?.toUpperCase() === targetCode);
    
    // Fallback if targetCode was GB, try UK
    if (!countryData && targetCode === "GB") {
        countryData = data.find((d: any) => d.country_code?.toUpperCase() === "UK");
    }
    // Fallback if targetCode was UK, try GB
    if (!countryData && targetCode === "UK") {
        countryData = data.find((d: any) => d.country_code?.toUpperCase() === "GB");
    }
    
    if (countryData) {
      const monthly = countryData.monthly_estimate_usd || 1500;
      const annual = monthly * 12;
      
      const sumIndices = (countryData.rent_index || 25) + (countryData.grocery_index || 25) + (countryData.transport_index || 25) + (countryData.utilities_index || 25);
      
      const rentPct = (countryData.rent_index || 25) / sumIndices;
      const foodPct = (countryData.grocery_index || 25) / sumIndices;
      const transportPct = (countryData.transport_index || 25) / sumIndices;
      const utilitiesPct = (countryData.utilities_index || 25) / sumIndices;
      
      return NextResponse.json({
         annualEstimateUsd: annual,
         breakdown: {
           rent: Math.round(annual * rentPct),
           food: Math.round(annual * foodPct),
           transport: Math.round(annual * transportPct),
           insurance: Math.round((countryData.utilities_index || 25) * 5), // rough mock scaling for insurance
           other: Math.round(annual * utilitiesPct)
         }
      });
    }

    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
