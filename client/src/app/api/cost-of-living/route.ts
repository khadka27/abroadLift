/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

// Research-backed monthly student living costs in USD per country (2024 estimates)
// Sources: Numbeo, OECD, government student finance guides
// Fields: rent, food, transport, insurance, other — all MONTHLY in USD
const COUNTRY_LIVING_COSTS: Record<string, {
  rent: number; food: number; transport: number; insurance: number; other: number;
}> = {
  // Anglophone / Major destinations
  US: { rent: 900,  food: 350, transport: 100, insurance: 120, other: 200 },
  CA: { rent: 850,  food: 300, transport: 100, insurance: 80,  other: 170 },
  AU: { rent: 950,  food: 330, transport: 110, insurance: 90,  other: 180 },
  GB: { rent: 950,  food: 280, transport: 120, insurance: 30,  other: 180 }, // NHS covers much insurance
  NZ: { rent: 750,  food: 280, transport: 90,  insurance: 70,  other: 150 },
  IE: { rent: 900,  food: 280, transport: 100, insurance: 60,  other: 160 },

  // Europe (Schengen + UK)
  DE: { rent: 650,  food: 220, transport: 80,  insurance: 60,  other: 130 },
  FR: { rent: 600,  food: 230, transport: 80,  insurance: 50,  other: 130 },
  NL: { rent: 700,  food: 220, transport: 80,  insurance: 100, other: 130 },
  SE: { rent: 550,  food: 220, transport: 70,  insurance: 50,  other: 120 },
  NO: { rent: 700,  food: 270, transport: 80,  insurance: 60,  other: 150 },
  DK: { rent: 680,  food: 260, transport: 80,  insurance: 60,  other: 140 },
  FI: { rent: 550,  food: 220, transport: 70,  insurance: 50,  other: 120 },
  CH: { rent: 1100, food: 320, transport: 100, insurance: 200, other: 200 },
  AT: { rent: 600,  food: 220, transport: 80,  insurance: 60,  other: 130 },
  BE: { rent: 600,  food: 210, transport: 80,  insurance: 60,  other: 130 },
  ES: { rent: 500,  food: 200, transport: 60,  insurance: 50,  other: 110 },
  IT: { rent: 500,  food: 210, transport: 60,  insurance: 50,  other: 110 },
  PL: { rent: 350,  food: 150, transport: 40,  insurance: 30,  other: 80  },
  PT: { rent: 500,  food: 200, transport: 60,  insurance: 50,  other: 110 },
  CZ: { rent: 380,  food: 150, transport: 40,  insurance: 30,  other: 80  },

  // Asia-Pacific
  JP: { rent: 600,  food: 250, transport: 80,  insurance: 50,  other: 130 },
  KR: { rent: 500,  food: 230, transport: 70,  insurance: 50,  other: 120 },
  CN: { rent: 350,  food: 180, transport: 50,  insurance: 30,  other: 90  },
  SG: { rent: 900,  food: 300, transport: 90,  insurance: 80,  other: 150 },
  MY: { rent: 280,  food: 150, transport: 40,  insurance: 30,  other: 70  },
  TH: { rent: 250,  food: 130, transport: 35,  insurance: 25,  other: 60  },
  IN: { rent: 150,  food: 80,  transport: 20,  insurance: 15,  other: 40  },

  // Middle East
  AE: { rent: 900,  food: 300, transport: 80,  insurance: 100, other: 170 },
  QA: { rent: 850,  food: 280, transport: 70,  insurance: 90,  other: 160 },

  // Americas
  MX: { rent: 350,  food: 170, transport: 40,  insurance: 30,  other: 80  },
  BR: { rent: 350,  food: 170, transport: 45,  insurance: 30,  other: 80  },

  // Default fallback (global student average)
  DEFAULT: { rent: 700, food: 250, transport: 80, insurance: 60, other: 140 },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawCode = (searchParams.get("countryCode") || "US").toUpperCase();

  const normalization: Record<string, string> = {
    USA: "US", UK: "GB", CAN: "CA", AUS: "AU", GER: "DE",
    NZL: "NZ", SGP: "SG", JPN: "JP", KOR: "KR", CHN: "CN",
    CHE: "CH", SWE: "SE", NOR: "NO", DNK: "DK", FIN: "FI",
    BEL: "BE", AUT: "AT", PRT: "PT", POL: "PL", CZE: "CZ",
    IRL: "IE", ARE: "AE", QAT: "QA", MYS: "MY", THA: "TH",
    IND: "IN", MEX: "MX", BRA: "BR",
  };

  const code = normalization[rawCode] || rawCode;
  const monthly = COUNTRY_LIVING_COSTS[code] || COUNTRY_LIVING_COSTS["DEFAULT"];

  // Return monthly values directly (FinancialDashboard divides by 12 itself if it treats as annual,
  // but here we return MONTHLY so the dashboard can multiply by 6 for 6 months)
  // Convention: return annual values so the dashboard divides by 12 for monthly then × 6 for 6m
  const annual = {
    rent:      monthly.rent      * 12,
    food:      monthly.food      * 12,
    transport: monthly.transport * 12,
    insurance: monthly.insurance * 12,
    other:     monthly.other     * 12,
  };

  return NextResponse.json({
    countryCode: code,
    monthlyEstimateUsd: Object.values(monthly).reduce((a, b) => a + b, 0),
    annualEstimateUsd: Object.values(annual).reduce((a, b) => a + b, 0),
    breakdown: annual,   // annual totals — FinancialDashboard divides by 12 then × 6
    monthlyBreakdown: monthly,
  });
}
