import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata: Metadata = {
  title: "AbroadLift — Find Universities That Actually Fit You",
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
    title: "AbroadLift — Find Universities That Actually Fit You",
    description:
      "Real-time university matching powered by government-grade education APIs.",
    url: "https://abroadlift.com",
    siteName: "AbroadLift",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-white text-[#0f172a] antialiased overflow-x-hidden font-poppins"
        suppressHydrationWarning={true}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
