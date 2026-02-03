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

      {/* Placeholder for custom content - shown for projects without custom case study content */}
      {item.slug !== "vesta" && (
        <section className="relative z-10 bg-black px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <p className="text-white/40 text-center py-32" style={{ fontFamily: "var(--font-inter)" }}>
              Project content coming soon...
            </p>
          </div>
        </section>
      )}
    </motion.div>
  );
}
