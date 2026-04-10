import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/seo";

interface BuildLegalMetadataOptions {
  title: string;
  description: string;
  path: string;
}

export function buildLegalMetadata({
  title,
  description,
  path,
}: BuildLegalMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} legal page`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}
