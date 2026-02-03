"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
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

export function StickyScroll({ content }: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index = Math.min(
      Math.floor(progress * content.length),
      content.length - 1
    );
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  // Transform for the first image's container scroll effect
  const firstImageScale = useTransform(scrollYProgress, [0, 0.15], [1.05, 1]);
  const firstImageRotate = useTransform(scrollYProgress, [0, 0.15], [15, 0]);

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${content.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="relative h-[300px] md:h-[400px]">
              {content.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="absolute inset-0 flex flex-col justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: activeIndex === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <h3
                    className="text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4"
                    style={{ fontFamily: "'Noe Display', serif", color: "white" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.description}
                  </p>
                  {item.subDescription && (
                    <p
                      className="text-sm md:text-base text-white/40 leading-relaxed mt-4"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.subDescription}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Right: Sticky Image */}
            <div className="relative" style={{ perspective: "1000px" }}>
              {content.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={
                    index === 0
                      ? {
                          rotateX: firstImageRotate,
                          scale: firstImageScale,
                        }
                      : undefined
                  }
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1920}
                    height={1080}
                    className="w-full h-auto rounded-2xl"
                    style={{
                      boxShadow:
                        index === 0
                          ? "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003"
                          : undefined,
                    }}
                    draggable={false}
                  />
                </motion.div>
              ))}
              {/* Placeholder for layout */}
              <div className="invisible">
                <Image
                  src={content[0].image}
                  alt=""
                  width={1920}
                  height={1080}
                  className="w-full h-auto rounded-2xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
