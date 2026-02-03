"use client";

import { motion } from "framer-motion";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyInfo } from "@/components/case-study/case-study-info";
import type { WorkItem } from "@/lib/work-data";

interface CaseStudyContentProps {
  item: WorkItem;
}

export function CaseStudyContent({ item }: CaseStudyContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0, 1],
      }}
      className="min-h-screen bg-black"
    >
      {/* Full-screen hero that insets on scroll */}
      <CaseStudyHero item={item} />

      {/* Project info section */}
      <CaseStudyInfo item={item} />
    </motion.div>
  );
}
