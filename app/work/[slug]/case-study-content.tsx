"use client";

import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyInfo } from "@/components/case-study/case-study-info";
import type { WorkItem } from "@/lib/work-data";

interface CaseStudyContentProps {
  item: WorkItem;
}

export function CaseStudyContent({ item }: CaseStudyContentProps) {
  return (
    <div className="min-h-screen bg-black" key={item.slug}>
      {/* Full-screen hero that insets on scroll */}
      <CaseStudyHero item={item} />

      {/* Project info section */}
      <CaseStudyInfo item={item} />
    </div>
  );
}
