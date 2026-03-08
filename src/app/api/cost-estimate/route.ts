import { NextRequest, NextResponse } from "next/server";

const API_NINJAS_KEY = process.env.API_NINJAS_KEY;

// Fallback data if API key is missing or city not found
const COUNTRY_BASE_COSTS: Record<string, Record<string, number>> = {
  US: {
    living: 1500,
    housing: 1200,
    food: 400,
    transport: 150,
    healthcare: 100,
  },
  CA: {
    living: 1300,
    housing: 1000,
    food: 350,
    transport: 120,
    healthcare: 50,
  },
  AU: {
    living: 1400,
    housing: 1100,
    food: 380,
    transport: 130,
    healthcare: 70,
  },
  GB: {
    living: 1200,
    housing: 1000,
    food: 320,
    transport: 140,
    healthcare: 40,
  },
  DE: { living: 1000, housing: 800, food: 300, transport: 90, healthcare: 30 },
  IN: { living: 400, housing: 300, food: 150, transport: 50, healthcare: 20 },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "New York";
  const country = searchParams.get("country") || "US";
  const tuitionUsd = parseFloat(searchParams.get("tuition_usd") || "20000");

  try {
    // 1. Fetch Exchange Rate (USD to NPR)
    // Using a public free API for demonstration, normally would use a pair from Ninja or Fixer
    let usdToNpr = 133.5; // Default fallback
    try {
      const exRes = await fetch("https://open.er-api.com/v6/latest/USD");
      const exData = await exRes.json();
      if (exData && exData.rates && exData.rates.NPR) {
        usdToNpr = exData.rates.NPR;
      }
    } catch {
      console.warn("Exchange rate fetch failed, using fallback 133.5");
    }

    // 2. Fetch Cost of Living Data (API Ninjas)
    let livingData: Record<string, number> | null = null;
    if (API_NINJAS_KEY) {
      try {
        const ninjaUrl = `https://api.api-ninjas.com/v1/costofliving?city=${city}`;
        const ninjaRes = await fetch(ninjaUrl, {
          headers: { "X-Api-Key": API_NINJAS_KEY },
        });
        if (ninjaRes.ok) {
          livingData = await ninjaRes.json();
        }
      } catch {
        console.warn("API Ninjas fetch failed");
      }
    }

    // Process and normalize costs
    // If Ninja data exists, we try to extract common indices.
    // Otherwise, we use our COUNTRY_BASE_COSTS model.
    const base =
      COUNTRY_BASE_COSTS[country.toUpperCase()] || COUNTRY_BASE_COSTS.US;

    // Monthly costs in USD
    const housing_usd = livingData?.rent_index
      ? base.housing * (livingData.rent_index / 100)
      : base.housing;
    const food_usd = livingData?.groceries_index
      ? base.food * (livingData.groceries_index / 100)
      : base.food;
    const transport_usd = base.transport;
    const healthcare_usd = base.healthcare;

    const monthly_living_usd =
      housing_usd + food_usd + transport_usd + healthcare_usd;
    const annual_living_usd = monthly_living_usd * 12;

    const total_usd = tuitionUsd + annual_living_usd;

    // Convert everything to NPR
    const response = {
      city,
      country,
      exchange_rate: usdToNpr,
      tuition_npr: Math.round(tuitionUsd * usdToNpr),
      living_npr: Math.round(annual_living_usd * usdToNpr),
      housing_npr: Math.round(housing_usd * 12 * usdToNpr),
      food_npr: Math.round(food_usd * 12 * usdToNpr),
      transport_npr: Math.round(transport_usd * 12 * usdToNpr),
      healthcare_npr: Math.round(healthcare_usd * 12 * usdToNpr),
      education_npr: Math.round(tuitionUsd * usdToNpr), // Tuition is the primary education cost
      total_npr: Math.round(total_usd * usdToNpr),
      monthly_npr: Math.round(monthly_living_usd * usdToNpr),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to estimate costs" },
      { status: 500 },
    );
  }
}
