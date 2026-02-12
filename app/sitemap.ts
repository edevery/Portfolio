import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/work-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edevery.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/work`, lastModified: new Date(), priority: 0.9 },
    { url: `${siteUrl}/archive`, lastModified: new Date(), priority: 0.6 },
    { url: `${siteUrl}/play`, lastModified: new Date(), priority: 0.5 },
  ];

  const caseStudies: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${siteUrl}/work/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticPages, ...caseStudies];
}
