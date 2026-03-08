import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata: Metadata = {
  title: "NextDegree — Find Universities That Actually Fit You",
  description:
    "Enter your English score, budget, and dream country. We instantly match you against 6,000+ programs across 7 countries — no login, no fees.",
  keywords: [
    "university finder",
    "study abroad",
    "IELTS",
    "scholarships",
    "education",
    "college match",
  ],
  openGraph: {
    title: "NextDegree — Find Universities That Actually Fit You",
    description:
      "Real-time university matching powered by government-grade education APIs.",
    url: "https://nextdegree.app",
    siteName: "NextDegree",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-[#07070f] text-slate-100 antialiased"
        suppressHydrationWarning={true}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
