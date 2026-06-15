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
    heading: "1. General Information Only",
    body: [
      "The content, tools, calculators, dashboards, estimates, checklists, comparisons, alerts, and other materials made available on AbroadLift (“Platform”) are provided for general informational, educational, and planning purposes only.",
      "AbroadLift is designed to help users understand study-abroad requirements, estimate expenses, organize documentation, compare options, and prepare for self-application.",
      "Nothing on this Platform should be interpreted as a guarantee, assurance, or binding commitment regarding any academic, visa, financial, employment, accommodation, immigration, or other third-party outcome.",
    ],
  },
  {
    heading: "2. Not a Consultancy or Advisory Service",
    body: [
      "AbroadLift is not an education consultancy, immigration consultancy, licensed migration advisory service, legal service, tax advisory service, or financial advisory service unless expressly stated in a separate written agreement.",
      "Use of this Platform does not create: a consultant-client relationship, an advisor-client relationship, an agency relationship, a fiduciary relationship, a legal representative relationship, or any formal representation before a university, embassy, authority, lender, insurer, housing provider, or other third party.",
      "Users remain solely responsible for their final decisions, submissions, payments, and communications.",
    ],
  },
  {
    heading: "3. No Guarantee of Admission, Visa, Scholarship, Loan, Job, or Other Outcome",
    body: [
      "AbroadLift does not guarantee: admission to any institution, visa approval, scholarship approval, education loan approval, accommodation availability, part-time or full-time employment, migration or post-study work rights, document acceptance by any third party, or the suitability of any country, institution, course, or service provider for a particular user.",
      "Any estimate, score, recommendation, readiness status, or affordability indication shown on the Platform is indicative only.",
    ],
  },
  {
    heading: "4. Estimates and Cost Breakdowns Are Indicative Only",
    body: [
      "The Platform may display cost breakdowns such as: before departure costs, first 90 days costs, monthly living costs, visa-related costs, application-related expenses, financial proof indicators, tuition references, and insurance, travel, housing, forex, and document-related costs.",
      "These are illustrative and estimated figures only.",
      "Actual costs may vary due to: country-specific policy changes, institutional fee updates, exchange-rate fluctuations, airline pricing, housing and city-level market conditions, individual lifestyle choices, third-party service charges, documentation needs, and personal circumstances.",
      "Users must independently verify all final costs and requirements before acting on any information shown on the Platform.",
    ],
  },
  {
    heading: "5. Accuracy, Completeness, and Timeliness",
    body: [
      "While AbroadLift aims to provide useful and reasonably organized information, we do not warrant or guarantee that all content on the Platform is: current, complete, accurate, official, error-free, suitable for your individual situation, or continuously available.",
      "Admission rules, visa policies, financial proof requirements, tuition fees, document rules, insurance requirements, and living costs can change without notice.",
      "Users must confirm critical information from official or authoritative sources before making decisions or payments.",
    ],
  },
  {
    heading: "6. No Legal, Immigration, Financial, Tax, or Regulatory Advice",
    body: [
      "The Platform does not provide: legal advice, immigration advice, visa strategy advice, tax advice, regulated financial advice, investment advice, lending advice, or any other regulated professional advice.",
      "If you require advice specific to your circumstances, you should consult a properly qualified and licensed professional in the relevant jurisdiction.",
    ],
  },
  {
    heading: "7. User Responsibility",
    body: [
      "By using AbroadLift, you acknowledge and agree that: you are responsible for reviewing and verifying your own eligibility; you are responsible for the accuracy and authenticity of the information and documents you submit; you are responsible for understanding the laws, regulations, and policies that apply to your destination and application; you are responsible for any applications, uploads, submissions, payments, and commitments made by you; and you are responsible for confirming all deadlines, documents, and conditions directly with the relevant institution or authority.",
      "AbroadLift shall not be responsible for any loss arising from reliance on incomplete, outdated, user-supplied, or third-party-supplied information.",
    ],
  },
  {
    heading: "8. Third-Party Institutions, Services, and Links",
    body: [
      "The Platform may mention, list, compare, integrate with, or link to third parties, including: universities and colleges, testing agencies, lenders, insurers, accommodation providers, forex/remittance providers, telecom or SIM providers, travel providers, document or logistics services, technology vendors, or other partners.",
      "Such references do not constitute: an endorsement, a guarantee, a certification, a recommendation of suitability, or a representation that those third parties will accept, approve, or serve you.",
      "AbroadLift is not responsible for: third-party content, third-party availability, pricing, communications, service quality, decisions, rejections, delays, policies, or privacy practices.",
      "Your dealings with third parties are solely between you and that third party, unless expressly stated otherwise in writing.",
    ],
  },
  {
    heading: "9. Data Sharing and Contact by External Entities",
    body: [
      "Where you request it, authorize it, trigger it through Platform actions, or separately consent to it, your personal data and relevant profile information may be shared with selected external entities, including institutions and service providers.",
      "As a result, such entities may contact you directly by: phone, SMS, WhatsApp, email, or other relevant communication channels.",
      "AbroadLift does not guarantee the conduct, quality, accuracy, or suitability of any external entity after lawful disclosure. Data handling by such external entities may also be governed by their own privacy policies and terms.",
      "Please review our Privacy Policy and Terms & Conditions for more information regarding data use, retention, and third-party sharing.",
    ],
  },
  {
    heading: "10. Cross-Border Nature of Services",
    body: [
      "Because AbroadLift supports overseas education journeys, some information flows, service providers, and external recipients may be located outside your country. As a result, information shown to you and services connected through the Platform may involve multiple jurisdictions and changing legal or operational conditions.",
      "Users should not assume that information displayed on the Platform is a substitute for destination-country legal, immigration, institutional, or regulatory guidance.",
    ],
  },
  {
    heading: "11. No Warranty",
    body: [
      "The Platform is provided on an “as is” and “as available” basis.",
      "To the fullest extent permitted by applicable law, AbroadLift disclaims all warranties, express or implied, including warranties relating to: accuracy, completeness, reliability, non-infringement, merchantability, fitness for a particular purpose, uninterrupted availability, and suitability for any specific user outcome.",
    ],
  },
  {
    heading: "12. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, AbroadLift, its founders, directors, employees, affiliates, contractors, vendors, and partners shall not be liable for any direct, indirect, incidental, consequential, punitive, or special loss arising out of or in connection with: reliance on information or estimates displayed on the Platform, errors or omissions in content, application rejection, visa refusal, missed deadlines, tuition or fee changes, exchange-rate fluctuations, third-party misconduct, financial loss, reputational loss, missed opportunities, or service interruptions.",
      "Nothing in this Disclaimer excludes liability where such exclusion is not permitted by law.",
    ],
  },
  {
    heading: "13. Updates to Content and Disclaimer",
    body: [
      "AbroadLift may modify, remove, update, or revise any content, feature, estimate model, checklist logic, or statement on the Platform at any time without notice.",
      "This Disclaimer may also be updated from time to time. Continued use of the Platform after updates constitutes acknowledgment of the latest version, subject to applicable law.",
    ],
  },
  {
    heading: "14. Contact",
    body: [
      "If you have questions regarding this Disclaimer, please contact: AbroadLift Support: info@abroadlift.com",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      description="Please review this disclaimer before relying on any planning or match outputs from AbroadLift."
      lastUpdated="June 15, 2026"
      sections={sections}
    />
  );
}
