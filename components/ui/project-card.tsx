"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/case-study/transition-link";

interface ProjectCardProps {
  title: string;
  description: string;
  categories: string[];
  image: string;
  accentColor?: string;
  slug: string;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  categories,
  image,
  accentColor = "#3b82f6",
  slug,
  className,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(150);

  useEffect(() => {
    if (contentRef.current) {
      // Measure content height + padding (30px top padding for spacing from image)
      const height = contentRef.current.offsetHeight + 30;
      setContentHeight(height);
    }
  }, [title, description, categories]);

  return (
    <TransitionLink href={`/work/${slug}`} className="block h-full">
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl cursor-pointer h-full bg-[#1e1e1e] border-none",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Project Image - contracts on hover */}
        <motion.div
          className="absolute overflow-hidden rounded-lg"
          animate={{
            top: isHovered ? 12 : 0,
            left: isHovered ? 12 : 0,
            right: isHovered ? 12 : 0,
            bottom: isHovered ? contentHeight : 0,
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content that reveals on hover - sits in the bottom accent area */}
        <motion.div
          ref={contentRef}
          className="absolute bottom-0 left-0 right-0 px-4 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Title */}
          <h3 className="text-white text-lg lg:text-xl font-semibold tracking-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/80 text-sm mt-1 line-clamp-2">
            {description}
          </p>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-1 text-xs rounded-full bg-white/20 text-white/90"
              >
                {cat}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </TransitionLink>
  );
}
