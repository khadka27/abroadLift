import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { buildLegalMetadata } from "@/lib/legalSeo";

export const metadata: Metadata = buildLegalMetadata({
  title: "Disclaimer",
  description:
    "Important disclaimer about educational estimates, third-party data accuracy, and non-legal advice status.",
  path: "/disclaimer",
});

const sections = [
  {
    heading: "General Information",
    body: [
      "AbroadLift provides informational and planning tools for study-abroad research and preparation.",
      "All content is provided on an as-is basis for general guidance.",
    ],
  },
  {
    heading: "No Guarantee of Outcomes",
    body: [
      "Match scores, admission probability ranges, cost estimates, and visa readiness indicators are predictive aids and not guarantees.",
      "Actual outcomes depend on official university, embassy, legal, and financial review processes.",
    ],
  },
  {
    heading: "Third-Party Data",
    body: [
      "Some platform outputs depend on third-party sources and APIs. Data may change, be delayed, incomplete, or unavailable.",
      "Users should verify critical information directly with official institutions before making decisions.",
    ],
  },
  {
    heading: "No Legal, Financial, or Immigration Advice",
    body: [
      "AbroadLift is not a law firm, financial advisory service, or immigration consultancy.",
      "For legal, financial, or immigration decisions, seek advice from qualified licensed professionals.",
    ],
  },
  {
    heading: "User Responsibility",
    body: [
      "You are responsible for checking deadlines, eligibility, fees, and documentation requirements with official channels.",
      "You are also responsible for ensuring information submitted to AbroadLift is complete and accurate.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "If you identify an issue with information shown on the platform, contact support so we can review and improve data quality.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      description="Please review this disclaimer before relying on any planning or match outputs from AbroadLift."
      lastUpdated="April 10, 2026"
      sections={sections}
    />
  );
}
