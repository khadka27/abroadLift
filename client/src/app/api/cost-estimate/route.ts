import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

const COUNTRY_CURRENCIES: Record<string, { code: string; symbol: string; defaultRate: number }> = {
  US: { code: "USD", symbol: "$", defaultRate: 1.0 },
  CA: { code: "CAD", symbol: "C$", defaultRate: 1.36 },
  GB: { code: "GBP", symbol: "£", defaultRate: 0.79 },
  AU: { code: "AUD", symbol: "A$", defaultRate: 1.50 },
  DE: { code: "EUR", symbol: "€", defaultRate: 0.93 },
  IN: { code: "INR", symbol: "₹", defaultRate: 83.50 },
};

function getCountryCurrency(countryCode: string) {
  let normalized = countryCode.toUpperCase().trim();
  if (normalized === "UK") normalized = "GB";
  if (normalized === "USA") normalized = "US";
  return COUNTRY_CURRENCIES[normalized] || COUNTRY_CURRENCIES.US;
}

function toDevanagariDigits(numStr: string): string {
  const devanagariMap: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  return numStr.split('').map(char => devanagariMap[char] || char).join('');
}

function formatLakhCrore(value: number): string {
  const num = Math.round(value);
  const numStr = num.toString();
  if (numStr.length <= 3) return numStr;
  const lastThree = numStr.substring(numStr.length - 3);
  const remaining = numStr.substring(0, numStr.length - 3);
  const groups = [];
  let i = remaining.length;
  while (i > 0) {
    if (i >= 2) {
      groups.unshift(remaining.substring(i - 2, i));
      i -= 2;
    } else {
      groups.unshift(remaining.substring(0, i));
      i = 0;
    }
  }
  return groups.join(',') + ',' + lastThree;
}

function toNepaliWords(value: number): string {
  const num = Math.round(value);
  if (num === 0) return "० रुपैयाँ";
  
  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num % 10000000) / 100000);
  let thousand = Math.floor((num % 100000) / 1000);
  let hundred = Math.floor((num % 1000) / 100);
  let remaining = num % 100;
  
  let parts = [];
  if (crore > 0) parts.push(`${toDevanagariDigits(crore.toString())} करोड`);
  if (lakh > 0) parts.push(`${toDevanagariDigits(lakh.toString())} लाख`);
  if (thousand > 0) parts.push(`${toDevanagariDigits(thousand.toString())} हजार`);
  if (hundred > 0) parts.push(`${toDevanagariDigits(hundred.toString())} सय`);
  if (remaining > 0 || parts.length === 0) {
    parts.push(`${toDevanagariDigits(remaining.toString())}`);
  }
  return parts.join(' ') + ' रुपैयाँ';
}

function toNepaliEnglishWords(value: number): string {
  const num = Math.round(value);
  if (num === 0) return "0 Rupees";
  
  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num % 10000000) / 100000);
  let thousand = Math.floor((num % 100000) / 1000);
  let hundred = Math.floor((num % 1000) / 100);
  let remaining = num % 100;
  
  let parts = [];
  if (crore > 0) parts.push(`${crore} Crore`);
  if (lakh > 0) parts.push(`${lakh} Lakh`);
  if (thousand > 0) parts.push(`${thousand} Thousand`);
  if (hundred > 0) parts.push(`${hundred} Hundred`);
  if (remaining > 0) {
    parts.push(`${remaining}`);
  }
  return parts.join(' ') + ' Rupees';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "New York";
  const country = searchParams.get("country") || "US";
  const tuitionUsd = parseFloat(searchParams.get("tuition_usd") || "20000");

  try {
    // 1. Fetch Exchange Rate (USD to NPR and local currencies)
    let usdToNpr = 134.5; // Updated default fallback
    let rates: Record<string, number> = {
      USD: 1.0,
      CAD: 1.36,
      GBP: 0.79,
      AUD: 1.50,
      EUR: 0.93,
      INR: 83.50,
      NPR: 134.5,
    };

    try {
      const exRes = await fetch("https://open.er-api.com/v6/latest/USD", {
        cache: "no-store",
        signal: AbortSignal.timeout(2000),
      });
      const exData = await exRes.json();
      if (exData && exData.rates) {
        if (exData.rates.NPR) usdToNpr = exData.rates.NPR;
        rates = { ...rates, ...exData.rates };
      }
    } catch {
      console.warn("Exchange rate fetch failed, using fallback exchange rates");
    }

    // 2. Fetch Cost of Living Data (API Ninjas)
    let livingData: Record<string, number> | null = null;
    if (API_NINJAS_KEY) {
      try {
        const ninjaUrl = `https://api.api-ninjas.com/v1/costofliving?city=${city}`;
        const ninjaRes = await fetch(ninjaUrl, {
          headers: { "X-Api-Key": API_NINJAS_KEY },
          signal: AbortSignal.timeout(2000),
        });
        if (ninjaRes.ok) {
          livingData = await ninjaRes.json();
        }
      } catch {
        console.warn("API Ninjas fetch failed");
      }
    }

    // Process and normalize costs
    const base = COUNTRY_BASE_COSTS[country.toUpperCase()] || COUNTRY_BASE_COSTS.US;

    // Monthly costs in USD
    const housing_usd = livingData?.rent_index
      ? base.housing * (livingData.rent_index / 100)
      : base.housing;
    const food_usd = livingData?.groceries_index
      ? base.food * (livingData.groceries_index / 100)
      : base.food;
    const transport_usd = base.transport;
    const healthcare_usd = base.healthcare;

    const monthly_living_usd = housing_usd + food_usd + transport_usd + healthcare_usd;
    const annual_living_usd = monthly_living_usd * 12;
    const total_usd = tuitionUsd + annual_living_usd;

    // 3. Local Currency Calculation
    const localCurrency = getCountryCurrency(country);
    const usdToLocal = rates[localCurrency.code] || localCurrency.defaultRate;

    const tuition_local = Math.round(tuitionUsd * usdToLocal);
    const living_local = Math.round(annual_living_usd * usdToLocal);
    const housing_local = Math.round(housing_usd * 12 * usdToLocal);
    const food_local = Math.round(food_usd * 12 * usdToLocal);
    const transport_local = Math.round(transport_usd * 12 * usdToLocal);
    const healthcare_local = Math.round(healthcare_usd * 12 * usdToLocal);
    const total_local = Math.round(total_usd * usdToLocal);
    const monthly_local = Math.round(monthly_living_usd * usdToLocal);

    // 4. NPR Calculations
    const tuition_npr_val = Math.round(tuitionUsd * usdToNpr);
    const living_npr_val = Math.round(annual_living_usd * usdToNpr);
    const housing_npr_val = Math.round(housing_usd * 12 * usdToNpr);
    const food_npr_val = Math.round(food_usd * 12 * usdToNpr);
    const transport_npr_val = Math.round(transport_usd * 12 * usdToNpr);
    const healthcare_npr_val = Math.round(healthcare_usd * 12 * usdToNpr);
    const total_npr_val = Math.round(total_usd * usdToNpr);
    const monthly_npr_val = Math.round(monthly_living_usd * usdToNpr);

    // Construct Response (Keeping root fields for backwards compatibility)
    const response = {
      city,
      country,
      exchange_rate: usdToNpr,
      
      // Original root fields
      tuition_npr: tuition_npr_val,
      living_npr: living_npr_val,
      housing_npr: housing_npr_val,
      food_npr: food_npr_val,
      transport_npr: transport_npr_val,
      healthcare_npr: healthcare_npr_val,
      education_npr: tuition_npr_val,
      total_npr: total_npr_val,
      monthly_npr: monthly_npr_val,

      // Local Currency Details
      local_currency: {
        code: localCurrency.code,
        symbol: localCurrency.symbol,
        rate_vs_usd: usdToLocal,
        tuition: tuition_local,
        living: living_local,
        housing: housing_local,
        food: food_local,
        transport: transport_local,
        healthcare: healthcare_local,
        total: total_local,
        monthly: monthly_local,
      },

      // Devanagari & Lakh/Crore Formatted NPR Details
      npr_formatted: {
        tuition_en: formatLakhCrore(tuition_npr_val),
        tuition_dev: toDevanagariDigits(formatLakhCrore(tuition_npr_val)),
        tuition_words: toNepaliWords(tuition_npr_val),
        tuition_words_en: toNepaliEnglishWords(tuition_npr_val),
        
        living_en: formatLakhCrore(living_npr_val),
        living_dev: toDevanagariDigits(formatLakhCrore(living_npr_val)),
        living_words: toNepaliWords(living_npr_val),
        living_words_en: toNepaliEnglishWords(living_npr_val),
        
        housing_en: formatLakhCrore(housing_npr_val),
        housing_dev: toDevanagariDigits(formatLakhCrore(housing_npr_val)),
        housing_words: toNepaliWords(housing_npr_val),
        housing_words_en: toNepaliEnglishWords(housing_npr_val),
        
        food_en: formatLakhCrore(food_npr_val),
        food_dev: toDevanagariDigits(formatLakhCrore(food_npr_val)),
        food_words: toNepaliWords(food_npr_val),
        food_words_en: toNepaliEnglishWords(food_npr_val),

        transport_en: formatLakhCrore(transport_npr_val),
        transport_dev: toDevanagariDigits(formatLakhCrore(transport_npr_val)),
        transport_words: toNepaliWords(transport_npr_val),
        transport_words_en: toNepaliEnglishWords(transport_npr_val),

        healthcare_en: formatLakhCrore(healthcare_npr_val),
        healthcare_dev: toDevanagariDigits(formatLakhCrore(healthcare_npr_val)),
        healthcare_words: toNepaliWords(healthcare_npr_val),
        healthcare_words_en: toNepaliEnglishWords(healthcare_npr_val),

        total_en: formatLakhCrore(total_npr_val),
        total_dev: toDevanagariDigits(formatLakhCrore(total_npr_val)),
        total_words: toNepaliWords(total_npr_val),
        total_words_en: toNepaliEnglishWords(total_npr_val),
        
        monthly_en: formatLakhCrore(monthly_npr_val),
        monthly_dev: toDevanagariDigits(formatLakhCrore(monthly_npr_val)),
        monthly_words: toNepaliWords(monthly_npr_val),
        monthly_words_en: toNepaliEnglishWords(monthly_npr_val),
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to estimate study costs:", error);
    return NextResponse.json(
      { error: "Failed to estimate costs" },
      { status: 500 },
    );
  }
}
