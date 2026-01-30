import { notFound } from "next/navigation";
import { getWorkItemBySlug, getAllSlugs } from "@/lib/work-data";
import { CaseStudyContent } from "./case-study-content";

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
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getWorkItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return <CaseStudyContent item={item} />;
}
