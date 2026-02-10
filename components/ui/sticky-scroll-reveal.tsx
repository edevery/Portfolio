"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ContentItem {
  title: string;
  description: string;
  subDescription?: string;
  image: string;
  hoverBgColor?: string;
}

interface StickyScrollProps {
  content: ContentItem[];
}

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Mobile component
function MobileStickyScroll({ content }: StickyScrollProps) {
  return (
    <div className="bg-black px-4 pt-6 pb-4 space-y-8">
      {content.map((item) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="bg-[#141414] rounded-2xl overflow-hidden">
            <div className="relative aspect-[8/9]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
            <div className="p-5">
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.description}
              </p>
              {item.subDescription && (
                <p
                  className="text-xs text-white/40 leading-relaxed mt-3"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item.subDescription}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Hover card component for desktop grid
function HoverRevealCard({ item }: { item: ContentItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(120);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight + 24;
      // Ensure minimum height for consistent spacing
      setContentHeight(Math.max(height, 120));
    }
  }, [item.title, item.description]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-square"
      style={{
        backgroundColor: isHovered && item.hoverBgColor ? item.hoverBgColor : "#141414",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Image - contracts on hover */}
      <motion.div
        className="absolute overflow-hidden rounded-xl"
        animate={{
          top: isHovered ? 12 : 0,
          left: isHovered ? 12 : 0,
          right: isHovered ? 12 : 0,
          bottom: isHovered ? contentHeight : 0,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Content - reveals on hover */}
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
        <h3
          className="text-xs font-bold tracking-wider uppercase mb-2 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.title}
        </h3>
        <p
          className="text-sm text-white/80 leading-relaxed max-w-md"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {item.description}
        </p>
        {item.subDescription && (
          <p
            className="text-xs text-white/60 mt-2 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {item.subDescription}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// Desktop component - 2x2 grid with hover reveal
function DesktopStickyScroll({ content }: StickyScrollProps) {
  return (
    <div className="bg-black mx-12 py-12">
      <div className="grid grid-cols-2 gap-4 items-start">
        {content.map((item) => (
          <HoverRevealCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

export function StickyScroll({ content }: StickyScrollProps) {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileStickyScroll content={content} />;
  }

  return <DesktopStickyScroll content={content} />;
}
