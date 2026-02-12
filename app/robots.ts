import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edevery.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/homepage1",
          "/homepage2",
          "/homepage3",
          "/homepage4",
          "/homepage5",
          "/homepage6",
          "/homepage7",
          "/homepage8",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
