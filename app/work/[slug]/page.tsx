import { notFound } from "next/navigation";
import {
  getWorkItemBySlug,
  getAllSlugs,
  getCategoryBySlug,
  getFilterableCategorySlugs,
  categories,
} from "@/lib/work-data";
import { CaseStudyContent } from "./case-study-content";
import WorkContent from "../work-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edevery.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = [...getAllSlugs(), ...getFilterableCategorySlugs()];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const category = getCategoryBySlug(slug);
  if (category) {
    const label = categories.find((c) => c.id === category)?.label ?? category;
    const title = `${label} Work — Emily Devery`;
    const description = `Selected ${label.toLowerCase()} work by Emily Devery.`;
    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { card: "summary_large_image" as const },
      alternates: { canonical: `/work/${slug}` },
    };
  }

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

  const category = getCategoryBySlug(slug);
  if (category) {
    return <WorkContent initialCategory={category} />;
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyContent item={item} />
    </>
  );
}
