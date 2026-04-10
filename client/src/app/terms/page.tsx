import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { buildLegalMetadata } from "@/lib/legalSeo";

export const metadata: Metadata = buildLegalMetadata({
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for using AbroadLift, including account obligations, acceptable use, and service limitations.",
  path: "/terms",
});

const sections = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using AbroadLift, you agree to be bound by these Terms and Conditions. If you do not agree, you should not use the platform.",
      "These terms apply to all visitors, registered users, and anyone interacting with AbroadLift services.",
    ],
  },
  {
    heading: "Service Scope",
    body: [
      "AbroadLift provides university discovery, match suggestions, and planning tools based on data from internal logic and third-party education sources.",
      "AbroadLift does not guarantee admission, visa approval, scholarship awards, or any specific academic or financial outcome.",
    ],
  },
  {
    heading: "Account Responsibilities",
    body: [
      "You are responsible for the accuracy of information you submit, including scores, budget, and personal profile details.",
      "You are responsible for maintaining the confidentiality of your account access and for all activities under your account.",
    ],
  },
  {
    heading: "Acceptable Use",
    body: [
      "You may not use the platform for unlawful activity, reverse engineering, abuse of APIs, spam, or attempts to disrupt services.",
      "You may not misrepresent your identity or submit false or manipulated academic or financial information.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All platform branding, interface design, and proprietary functionality are owned by AbroadLift or its licensors.",
      "Third-party data, names, logos, and trademarks remain the property of their respective owners.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, AbroadLift is not liable for indirect, incidental, or consequential damages from the use of the platform.",
      "AbroadLift tools are advisory in nature and should not replace official guidance from universities, embassies, or legal professionals.",
    ],
  },
  {
    heading: "Changes to Terms",
    body: [
      "We may revise these terms to reflect legal, technical, or business updates. Updated terms will be posted on this page.",
      "Your continued use of AbroadLift after updates means you accept the revised terms.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "For legal questions about these terms, contact the AbroadLift support team through official platform channels.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms and Conditions"
      description="Please read these terms carefully before using AbroadLift services."
      lastUpdated="April 10, 2026"
      sections={sections}
    />
  );
}
