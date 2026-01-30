"use client";

import { motion } from "framer-motion";
import type { WorkItem } from "@/lib/work-data";

interface CaseStudyHeroProps {
  item: WorkItem;
}

export function CaseStudyHero({ item }: CaseStudyHeroProps) {
  return (
    <div className="relative h-screen w-full bg-black">
      {/* Hero container - animates inset from edges */}
      <motion.div
        className="absolute overflow-hidden"
        initial={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 0,
        }}
        animate={{
          top: 48,
          left: 48,
          right: 48,
          bottom: 48,
          borderRadius: 24,
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0, 1],
          delay: 0.3,
        }}
      >
        {item.heroMedia.type === "video" ? (
          <video
            src={item.heroMedia.src}
            poster={item.heroMedia.poster}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <motion.img
            src={item.heroMedia.src}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.4, 0, 0, 1],
              delay: 0.3,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}
