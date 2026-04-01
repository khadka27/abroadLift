/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = (searchParams.get("countryCode") || "US").toUpperCase();

  try {
    const url = process.env.WHERENEXT_API_URL || "https://getwherenext.com/api/data/cost-of-living";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch from WhereNext API");
    
    const json = await res.json();
    const data = json.data || [];
    
    // Default AU mapping: WhereNext uses AU.
    let targetCode = countryCode;
    if (targetCode === "GB") targetCode = "GB"; // "uk" API usage typically correlates to GB in standard lists or UK. Let's see if WhereNext has GB or UK. WhereNext has UK? 
    // In fact ISO 3166-1 alpha-2 for United Kingdom is GB.
    
    // Find precise country
    let countryData = data.find((d: any) => d.country_code?.toUpperCase() === targetCode);
    
    if (!countryData && targetCode === "GB") {
        countryData = data.find((d: any) => d.country_code?.toUpperCase() === "UK");
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
