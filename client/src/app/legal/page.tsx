import type { Metadata } from "next";
import Link from "next/link";
import { buildLegalMetadata } from "@/lib/legalSeo";

export const metadata: Metadata = buildLegalMetadata({
  title: "Legal Center",
  description:
    "Read AbroadLift legal policies including Terms, Privacy Policy, Cookie Policy, and Disclaimer.",
  path: "/legal",
});

const legalLinks = [
  {
    href: "/terms",
    title: "Terms and Conditions",
    description: "Rules for using AbroadLift services and platform features.",
  },
  {
    href: "/privacy-policy",
    title: "Privacy Policy",
    description:
      "How we collect, use, retain, and protect personal information.",
  },
  {
    href: "/cookie-policy",
    title: "Cookie Policy",
    description:
      "Details about cookies and tracking technologies used on our site.",
  },
  {
    href: "/disclaimer",
    title: "Disclaimer",
    description:
      "Important limitations on guidance, estimates, and third-party data.",
  },
];

export default function LegalCenterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Legal Center
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            This page provides a complete set of legal documents for AbroadLift.
            Please review these pages before using the platform, creating an
            account, or relying on any match recommendations.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {legalLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
