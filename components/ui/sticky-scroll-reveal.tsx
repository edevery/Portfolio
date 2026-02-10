"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

interface ContentItem {
  title: string;
  description: string;
  subDescription?: string;
  image: string;
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

// Mobile component - no scroll tracking needed
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
          {/* Unified card with image and text */}
          <div className="bg-[#141414] rounded-2xl overflow-hidden">
            {/* Image at top */}
            <div className="relative aspect-[8/9]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                draggable={false}
              />
            </div>

            {/* Text content at bottom - Relationship Context style */}
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

// Desktop component - with scroll tracking
function DesktopStickyScroll({ content }: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const carouselX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${-(content.length - 1) * 100}%`]
  );

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${content.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div
          className="flex gap-8 pl-12"
          style={{ x: carouselX }}
        >
          {content.map((item) => (
            <motion.div
              key={item.title}
              className="flex-shrink-0 w-[80vw] lg:w-[70vw]"
            >
              {/* Card */}
              <div className="bg-[#141414] rounded-3xl overflow-hidden border border-white/5">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10">
                  <h3
                    className="text-2xl lg:text-3xl tracking-tight mb-3"
                    style={{ fontFamily: "'Noe Display', serif", color: "white" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base lg:text-lg text-white/60 leading-relaxed max-w-2xl"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.description}
                  </p>
                  {item.subDescription && (
                    <p
                      className="text-sm text-white/40 leading-relaxed mt-4 max-w-2xl"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.subDescription}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function StickyScroll({ content }: StickyScrollProps) {
  const isMobile = useIsMobile();

  // Show nothing during SSR/hydration to avoid mismatch
  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileStickyScroll content={content} />;
  }

  return <DesktopStickyScroll content={content} />;
}
