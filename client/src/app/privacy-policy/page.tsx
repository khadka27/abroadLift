import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { buildLegalMetadata } from "@/lib/legalSeo";

export const metadata: Metadata = buildLegalMetadata({
  title: "Privacy Policy",
  description:
    "AbroadLift Privacy Policy describing data collection, usage, retention, security, and user rights.",
  path: "/privacy-policy",
});

const sections = [
  {
    heading: "Information We Collect",
    body: [
      "We collect information you provide directly, such as name, email, phone number, profile details, study preferences, and uploaded planning inputs.",
      "We also collect technical data such as device, browser, and interaction data needed for security, analytics, and service reliability.",
    ],
  },
  {
    heading: "How We Use Information",
    body: [
      "We use personal and profile information to provide match results, personalize recommendations, improve product quality, and support account access.",
      "We may use aggregated, non-identifiable data for analytics, reporting, and service optimization.",
    ],
  },
  {
    heading: "Data Sources and Sharing",
    body: [
      "Some recommendation outputs rely on third-party education data providers and APIs integrated into our services.",
      "We do not sell personal data. We may share data with service providers strictly to operate platform functionality, security, and communications.",
    ],
  },
  {
    heading: "Data Retention",
    body: [
      "We retain data only for as long as necessary to deliver services, comply with legal obligations, resolve disputes, and enforce agreements.",
      "You may request deletion of your account data, subject to legal and operational retention requirements.",
    ],
  },
  {
    heading: "Security",
    body: [
      "We implement reasonable technical and organizational safeguards to protect data against unauthorized access and misuse.",
      "No online transmission or storage system is fully risk-free, so users should also protect account credentials and devices.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal information.",
      "To exercise rights requests, contact us through official support channels and include sufficient verification details.",
    ],
  },
  {
    heading: "Policy Updates",
    body: [
      "This Privacy Policy may be updated to reflect legal requirements and platform changes. The latest version will always appear on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="How AbroadLift handles your personal information and protects your privacy."
      lastUpdated="April 10, 2026"
      sections={sections}
    />
  );
}
