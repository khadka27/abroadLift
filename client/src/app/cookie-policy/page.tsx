import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { buildLegalMetadata } from "@/lib/legalSeo";

export const metadata: Metadata = buildLegalMetadata({
  title: "Cookie Policy",
  description:
    "Cookie Policy for AbroadLift, including essential, analytics, and preference cookie usage details.",
  path: "/cookie-policy",
});

const sections = [
  {
    heading: "What Are Cookies",
    body: [
      "Cookies are small data files stored on your device when you visit a website.",
      "They help websites remember actions and preferences over time.",
    ],
  },
  {
    heading: "How AbroadLift Uses Cookies",
    body: [
      "We use essential cookies to maintain session state, authentication flows, and core platform functionality.",
      "We may use analytics cookies to understand usage patterns and improve performance and user experience.",
    ],
  },
  {
    heading: "Cookie Categories",
    body: [
      "Essential Cookies: Required for login, security checks, and service stability.",
      "Preference Cookies: Store language, interface, and user settings where available.",
      "Analytics Cookies: Help measure engagement and technical reliability in aggregate form.",
    ],
  },
  {
    heading: "Third-Party Technologies",
    body: [
      "Some cookies or similar technologies may be set by third-party services integrated into AbroadLift, such as analytics and infrastructure providers.",
      "Third-party processing is subject to the policies of those providers.",
    ],
  },
  {
    heading: "Managing Cookies",
    body: [
      "You can control or delete cookies through your browser settings. Blocking essential cookies may affect platform functionality.",
      "Where applicable, cookie controls may also be available in platform settings.",
    ],
  },
  {
    heading: "Policy Updates",
    body: [
      "This Cookie Policy may change as technologies and legal requirements evolve. Updated versions will be posted on this page.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      description="How cookies and similar technologies are used across AbroadLift services."
      lastUpdated="April 10, 2026"
      sections={sections}
    />
  );
}
