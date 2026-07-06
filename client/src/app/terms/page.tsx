import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { buildLegalMetadata } from "@/lib/legalSeo";
import { sections } from "@/lib/terms-data";

export const metadata: Metadata = buildLegalMetadata({
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for using AbroadLift, including account obligations, acceptable use, and service limitations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms and Conditions"
      description="These Terms & Conditions (“Terms”) govern your access to and use of the AbroadLift website, mobile application, calculators, dashboards, saved profiles, alerts, tools, content, and related services (collectively, the “Platform”)."
      lastUpdated="June 15, 2026"
      sections={sections}
    />
  );
}
