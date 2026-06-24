import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = (searchParams.get("countryCode") || "USA").toUpperCase();

  // Return standard static steps per country to avoid external API calls
  const countrySteps: Record<string, Array<{ title: string; description: string }>> = {
    USA: [
      { title: "SEVIS Fee Payment", description: "Pay the SEVIS I-901 fee and obtain the receipt." },
      { title: "DS-160 Form Completion", description: "Complete the online non-immigrant visa application." },
      { title: "Visa Interview", description: "Schedule and attend your visa interview at the US embassy." }
    ],
    CA: [
      { title: "Study Permit Application", description: "Apply for a Canadian study permit online or at a VAC." },
      { title: "Biometrics", description: "Provide biometrics if required by IRCC." },
      { title: "Medical Exam", description: "Undergo a medical exam by an IRCC panel physician." }
    ],
    UK: [
      { title: "Student Visa (Tier 4) Application", description: "Apply online for your UK Student Visa." },
      { title: "IHS Fee Payment", description: "Pay the Immigration Health Surcharge as part of application." },
      { title: "Biometric Residence Permit (BRP)", description: "Collect your BRP card within 10 days of arrival." }
    ]
  };

  const steps = countrySteps[countryCode] || [
    { title: "Financial Documentation", description: "Standard proof of funds for 1 year." },
    { title: "Language Proficiency Scans", description: "Certified copies of English/local language proficiency." },
    { title: "Passport Application", description: "Ensure passport is valid for at least 6 months beyond stay." }
  ];

  return NextResponse.json({ steps });
}
