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
    heading: "1. Introduction",
    body: [
      "AbroadLift (“AbroadLift,” “we,” “us,” or “our”) operates a digital platform that helps users explore overseas education opportunities, compare destinations, estimate costs, organize documents, track readiness, and prepare to self-apply to institutions abroad.",
      "AbroadLift is an information and self-application support platform. We do not hold ourselves out as an education consultancy, immigration consultancy, migration agent, legal advisor, or financial advisor unless explicitly stated in a separate written agreement.",
      "This Privacy Policy explains how we collect, use, store, disclose, transfer, retain, and otherwise process personal data when you use our website, app, dashboard, forms, calculators, saved profiles, uploads, communications, and related services (collectively, the “Platform”).",
      "By accessing or using the Platform, creating an account, submitting your information, or interacting with us, you acknowledge that you have read and understood this Privacy Policy.",
    ],
  },
  {
    heading: "2. Scope",
    body: [
      "This Privacy Policy applies to personal data processed by AbroadLift in connection with: our website and app; account registration and login; forms, cost calculators, and dashboards; saved preferences and shortlists; uploads and document handling; customer support; notifications and communications; partner referrals or introductions where you request or authorize them; and analytics, security, fraud prevention, and service improvement.",
      "This Privacy Policy does not govern third-party websites, apps, institutions, or service providers that may have their own privacy policies and terms.",
    ],
  },
  {
    heading: "3. Important Positioning of AbroadLift",
    body: [
      "AbroadLift is designed to help users make informed decisions and prepare to self-apply. We may provide information, tools, structure, reminders, and optional introductions, but we do not automatically act as your consultant, legal representative, migration agent, or admission agent.",
      "Because of this model, some personal data is used to: personalize your dashboard; generate cost and readiness estimates; create checklists; show relevant opportunities; and connect you with external entities only where you request it, trigger it, or separately consent to it.",
    ],
  },
  {
    heading: "4. Information We Collect",
    body: [
      "We may collect the following categories of personal data.",
      "4.1 Information you provide directly: This may include full name, email address, phone number, WhatsApp number, address and country of residence, age or date of birth, nationality and citizenship details, passport status and, where relevant, passport-related details, current education level, institution, grades, backlog history, test scores, and academic records, preferred destination countries, cities, courses, institutions, and intakes, affordability inputs, budget ranges, funding preferences, bank-balance indicators, scholarship preferences, uploaded documents such as transcripts, score reports, passports, resumes, statements of purpose, recommendation letters, photographs, and financial records, notes, preferences, and responses submitted through forms or assessments, and any information you share in communications with us.",
      "4.2 Information collected automatically: When you use the Platform, we may automatically collect device information, browser type, operating system, IP address, approximate location inferred from technical data, access times, pages viewed, clicks, scrolls, session activity, referring URLs, cookie and similar identifier data, and crash logs, performance logs, and diagnostic data.",
      "4.3 Information from third parties: We may receive information from public institutional sources, partner platforms, lead or communications tools, analytics providers, authentication providers, customer support vendors, service providers you have asked us to connect with, or educational institutions or other third parties where permitted by law or authorized by you.",
    ],
  },
  {
    heading: "5. Data We May Infer or Generate",
    body: [
      "We may create or infer internal data points from the information you provide or your use of the Platform, such as: estimated budget range, application readiness status, probable eligibility category, likely document gaps, cost estimates, intake suitability, destination matching signals, shortlist ranking logic, and user segmentation for product improvement.",
      "These inferred outputs are intended to support planning and personalization and may not always reflect final real-world outcomes.",
    ],
  },
  {
    heading: "6. How We Use Your Personal Data",
    body: [
      "We may use your personal data for the following purposes:",
      "6.1 To provide the Platform: We use personal data to create and manage user accounts, authenticate users, save preferences and dashboards, generate cost breakdowns, generate checklists and reminders, show relevant country, institution, course, and intake information, and power calculators, comparisons, and self-apply tools.",
      "6.2 To personalize your experience: We may use data to customize recommendations, tailor dashboards, display relevant content and alerts, and improve the relevance of estimates and planning tools.",
      "6.3 To communicate with you: We may contact you regarding account setup, service notifications, reminders, updates to estimates or saved items, support responses, product and security notices, requested information, and optional marketing and promotional messages where permitted or consented to.",
      "6.4 To share data where you request or consent: Where you expressly request, trigger, or consent, we may share your information with selected third parties so they can contact you or deliver relevant services.",
      "6.5 To secure and improve the Platform: We may use data for fraud prevention, abuse detection, security monitoring, service troubleshooting, analytics, product development, internal testing, quality assurance, and performance monitoring.",
      "6.6 To comply with law and protect rights: We may use data to comply with legal obligations, respond to lawful requests, enforce our terms, investigate disputes or suspected misconduct, defend legal claims, and maintain records and audit trails.",
    ],
  },
  {
    heading: "7. Legal Basis and Consent",
    body: [
      "Where applicable law requires it, we process personal data on one or more of the following grounds: your consent, your request for services or platform functionality, legitimate operational needs consistent with applicable law, legal compliance, or fraud prevention, security, and recordkeeping.",
      "Where we rely on consent: we seek to make that consent clear, specific, informed, and affirmative; you may withdraw consent for certain future processing where applicable; and withdrawal will not invalidate past processing that was lawful before withdrawal.",
      "If you withdraw consent for a feature that depends on that data, some Platform functionality may no longer be available to you.",
    ],
  },
  {
    heading: "8. Sharing of Personal Data",
    body: [
      "We may share personal data in the following circumstances.",
      "8.1 With service providers and processors: We may share data with vendors and service providers that help us operate the Platform, such as cloud hosting providers, analytics vendors, CRM and communication vendors, authentication and identity providers, email, SMS, and WhatsApp communication tools, customer support tools, storage, logging, and security tools, or document processing or workflow tools. These parties are expected to process data only as needed for their services to us and subject to contractual or operational safeguards.",
      "8.2 With external entities you request or authorize: Where you request it, trigger it through platform actions, or separately consent, we may share relevant personal data with universities and educational institutions, counselors or support providers, exam providers, lenders or loan facilitators, insurers, accommodation providers, telecom or SIM providers, forex and remittance providers, travel-related providers, document verification or logistics providers, or selected study-abroad partners.",
      "This shared data may include your name, contact details, academic profile, destination and course preferences, budget range, readiness status, document status, uploaded materials, and financial preparation indicators.",
      "8.3 For legal or protection reasons: We may disclose information where reasonably necessary to comply with law, regulation, court order, or lawful government request; investigate fraud, abuse, or security incidents; enforce our agreements; or protect our rights, users, systems, or the public.",
      "8.4 In business transfers: If we undergo a restructuring, investment, merger, acquisition, or asset transfer, personal data may be transferred as part of that transaction, subject to appropriate continuity of protection.",
    ],
  },
  {
    heading: "9. Third-Party Contact and Outreach",
    body: [
      "If you separately consent to partner sharing or request a referral/introduction, you agree that the relevant third party may contact you by phone, SMS, WhatsApp, email, or other relevant communication channels.",
      "Once data is lawfully shared with a third party at your request or with your consent, that third party’s own privacy practices and terms may also apply. AbroadLift does not fully control how an independent third party uses your data after lawful disclosure to them.",
      "You may withdraw future sharing consent by contacting us or using available controls, but disclosures already made before withdrawal may not always be reversible.",
    ],
  },
  {
    heading: "10. Cross-Border Data Processing and Transfers",
    body: [
      "Because AbroadLift supports overseas education journeys, your personal data may be processed, stored, accessed, or transferred across jurisdictions, including outside your home country.",
      "This may occur: when our vendors or infrastructure operate internationally; when you request information about institutions or services abroad; when you authorize sharing with external entities outside your country; or when support, analytics, storage, or communications are handled through international systems.",
      "We take steps we consider reasonable to protect personal data during such processing and transfers. Some cross-border transfers may also be subject to applicable legal restrictions or government notifications.",
    ],
  },
  {
    heading: "11. Children and Age Restrictions",
    body: [
      "AbroadLift is designed primarily for users who are 18 years of age or older.",
      "Users under 18 should not independently create accounts or submit personal data through the Platform unless we expressly permit a parent- or guardian-controlled process.",
      "Where we knowingly process personal data of a child in a permitted workflow, we may require verifiable parental or guardian consent and may apply additional restrictions. Current Indian privacy law treats a child as an individual who has not completed 18 years of age and requires verifiable parental consent before processing a child’s personal data.",
      "If you believe that a child has provided us personal data without appropriate authorization, please contact us so we can review and take appropriate action.",
    ],
  },
  {
    heading: "12. Data Retention",
    body: [
      "We retain personal data only for as long as reasonably necessary for the purposes described in this Privacy Policy, unless a longer period is required or permitted by law.",
      "Depending on the nature of the data and purpose, we may retain personal data for up to 10 years where reasonably necessary, including for: maintaining your profile and service history, future re-engagement, fraud prevention, security monitoring, dispute resolution, enforcement of contractual rights, and compliance, audit, and recordkeeping.",
      "In some cases, we may delete, anonymize, restrict, or archive data earlier where continued retention is no longer reasonably necessary.",
      "Where applicable law requires erasure when a specified purpose is no longer being served, we will comply with those requirements. Current Indian rules also contemplate erasure timing for certain classes of data fiduciaries, notice before erasure in some cases, and minimum retention of certain logs for one year for security purposes.",
      "Retention does not mean all retained data is actively used throughout the retention period. Some data may be moved to archival, restricted-access, or backup environments.",
    ],
  },
  {
    heading: "13. Security",
    body: [
      "We use reasonable technical, organizational, and administrative measures to protect personal data against unauthorized access, misuse, disclosure, alteration, destruction, or loss.",
      "These measures may include, where appropriate: access controls, encryption or masking, logging and monitoring, backup and recovery controls, role-based restrictions, vendor management, or security review processes.",
      "No online system is completely risk-free, and we cannot guarantee absolute security. Current Indian rules require reasonable security safeguards and outline examples such as encryption, access control, logging, and processor safeguards.",
    ],
  },
  {
    heading: "14. Personal Data Breach Response",
    body: [
      "If we become aware of a personal data breach affecting your personal data, we may take steps such as: investigating the incident, containing and mitigating its effects, notifying affected users where required, notifying the relevant authority or board where required, and improving controls to reduce recurrence.",
      "Current Indian rules require affected data principals to be informed in a concise, clear, and plain manner and require breach intimation to the Board, including updated details within seventy-two hours or such longer period as may be allowed.",
    ],
  },
  {
    heading: "15. Your Rights and Choices",
    body: [
      "Subject to applicable law, you may have the right to: access certain personal data we hold about you, correct inaccurate or incomplete data, update outdated data, request deletion or erasure in appropriate circumstances, withdraw consent for certain future processing, object to or restrict some processing where applicable, request information about third-party sharing, or raise a complaint or grievance.",
      "Current Indian law gives data principals rights to correction, completion, updating, erasure, and grievance redressal, and requires consent withdrawal to be as easy as giving consent.",
      "You may exercise available rights by contacting us using the details in the “Contact Us / Grievance” section below. We may ask you to verify your identity before fulfilling a request.",
      "We may deny, limit, or defer a request where permitted by law, including where retention remains reasonably necessary for legal compliance, fraud prevention, security, audit, or dispute defense.",
    ],
  },
  {
    heading: "16. Communication Preferences",
    body: [
      "You may opt out of non-essential promotional communications through unsubscribe links, communication settings, or by contacting us.",
      "However, we may still send service-related communications that are necessary for: account administration, security, support, transaction or workflow completion, or legal or policy notices.",
    ],
  },
  {
    heading: "17. Cookies and Similar Technologies",
    body: [
      "We may use cookies, SDKs, pixels, local storage, and similar technologies to: keep you signed in, remember preferences, understand usage, improve performance, measure engagement, and support analytics and communications.",
      "You may control cookies through browser settings or device controls, but some features may not function properly if certain cookies are disabled.",
      "If you implement a separate Cookie Policy or consent banner, it should be read together with this Privacy Policy.",
    ],
  },
  {
    heading: "18. Public, User-Generated, and Shared Content",
    body: [
      "If the Platform allows you to post, comment, share, or publish content publicly or with other users, that content may be visible to others depending on the feature design.",
      "Please do not post sensitive personal data publicly unless you are comfortable with that disclosure.",
    ],
  },
  {
    heading: "19. Accuracy of Information",
    body: [
      "You are responsible for ensuring that the information you provide is accurate, lawful, and up to date.",
      "If you submit information about another person, you must have the authority to do so and to allow us to process it for the relevant purpose.",
    ],
  },
  {
    heading: "20. Data of Nepal and South Asia-Based Users",
    body: [
      "AbroadLift is designed for users across South Asia, including Nepal and India. Privacy rights may vary by country, and we aim to handle personal data in a manner consistent with applicable law and reasonable privacy safeguards.",
      "Nepal’s Constitution expressly protects the privacy of a person’s residence, property, documents, data, correspondence, and character, except in accordance with law.",
      "If you are located in a jurisdiction that grants additional privacy rights, we will aim to honor those rights where applicable and operationally feasible.",
    ],
  },
  {
    heading: "21. External Links and Third-Party Platforms",
    body: [
      "The Platform may contain links to external websites, forms, portals, or apps operated by third parties.",
      "We are not responsible for the privacy, content, or security practices of those external services. You should review their privacy policies before submitting personal data to them.",
    ],
  },
  {
    heading: "22. Changes to this Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in: law, regulation, guidance, business operations, technology, platform features, or security practices.",
      "When we update this Privacy Policy, we will revise the “Last Updated” date and may provide additional notice where appropriate.",
      "Your continued use of the Platform after an update may constitute acknowledgment of the updated Privacy Policy, subject to applicable law and any fresh consent requirements.",
    ],
  },
  {
    heading: "23. Contact Us / Grievance",
    body: [
      "For privacy questions, rights requests, complaints, or grievance redressal, please contact: AbroadLift Support: info@abroadlift.com",
      "Please include enough detail for us to understand and verify your request. We may need to confirm your identity before processing certain requests.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="How AbroadLift handles your personal information and protects your privacy."
      lastUpdated="June 15, 2026"
      sections={sections}
    />
  );
}
