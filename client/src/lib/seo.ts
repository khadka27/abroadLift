export const siteConfig = {
  name: "AbroadLift",
  title: "AbroadLift | Find Universities That Actually Fit You",
  description:
    "Enter your English score, budget, and dream country. We instantly match you against 6,000+ programs across 7 countries.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://abroadlift.com",
  ogImage: "/logo.png",
  locale: "en_US",
} as const;

export const publicRoutes = [
  "/",
  "/search",
  "/matches",
  "/eligibility",
  "/costing",
  "/visa-rate",
  "/register",
  "/login",
  "/legal",
  "/terms",
  "/privacy-policy",
  "/cookie-policy",
  "/disclaimer",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
