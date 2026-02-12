import { notFound } from "next/navigation";
import Script from "next/script";
import { getWorkItemBySlug, getAllSlugs } from "@/lib/work-data";
import { CaseStudyContent } from "./case-study-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edevery.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = getWorkItemBySlug(slug);

  if (!item) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${item.title} — Emily Devery`,
    description: item.description,
    openGraph: {
      title: `${item.title} — Emily Devery`,
      description: item.description,
      images: [{ url: item.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image" as const,
    },
    alternates: {
      canonical: `/work/${slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getWorkItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description,
    image: `${siteUrl}${item.image}`,
    url: `${siteUrl}/work/${slug}`,
    creator: {
      "@type": "Person",
      name: "Emily Devery",
    },
  };

  return (
    <>
      <Script
        id={`jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyContent item={item} />
    </>
  );
}
