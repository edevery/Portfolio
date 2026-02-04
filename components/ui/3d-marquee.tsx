"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
}

export function ThreeDMarquee({ images, className }: ThreeDMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 3D perspective transforms
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  // Split images into 4 rows
  const rows = 4;
  const imagesPerRow = Math.ceil(images.length / rows);
  const imageRows: string[][] = [];

  for (let i = 0; i < rows; i++) {
    const start = i * imagesPerRow;
    const rowImages = images.slice(start, start + imagesPerRow);
    // Duplicate images to create seamless loop effect
    imageRows.push([...rowImages, ...rowImages, ...rowImages]);
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden py-8", className)}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="flex flex-col gap-4"
      >
        {imageRows.map((row, rowIndex) => (
          <MarqueeRow
            key={rowIndex}
            images={row}
            scrollYProgress={scrollYProgress}
            direction={rowIndex % 2 === 0 ? 1 : -1}
          />
        ))}
      </motion.div>

      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent z-10" />
    </div>
  );
}

interface MarqueeRowProps {
  images: string[];
  scrollYProgress: MotionValue<number>;
  direction: number;
}

function MarqueeRow({ images, scrollYProgress, direction }: MarqueeRowProps) {
  // Move based on scroll - direction determines left/right movement
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [direction > 0 ? "0%" : "-33.33%", direction > 0 ? "-33.33%" : "0%"]
  );

  return (
    <motion.div
      style={{ x: translateX }}
      className="flex gap-4"
    >
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative flex-shrink-0 w-[320px] h-[180px] md:w-[480px] md:h-[270px] rounded-xl overflow-hidden"
        >
          <Image
            src={image}
            alt={`Marquee image ${index + 1}`}
            fill
            className="object-contain"
            draggable={false}
          />
        </div>
      ))}
    </motion.div>
  );
}
