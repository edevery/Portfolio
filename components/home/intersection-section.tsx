"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { TaglineReveal } from "./tagline-reveal";
import { VennDiagram } from "./venn-diagram";

const Ballpit = dynamic(() => import("@/components/Ballpit"), { ssr: false });

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function IntersectionSection({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [progress, setProgress] = useState(0);
  const [taglineDone, setTaglineDone] = useState(false);
  const [vennFillDone, setVennFillDone] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

  // Preload Ballpit chunk as soon as tagline finishes (before Venn fill completes)
  useEffect(() => {
    if (taglineDone) {
      import("@/components/Ballpit");
    }
  }, [taglineDone]);

  const handleTaglineDone = () => {
    setTaglineDone(true);
    onComplete?.();
  };

  const handleFillComplete = useCallback(() => {
    setVennFillDone(true);
  }, []);

  const hydrated = isMobile !== null;

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{
        height: !hydrated ? "250vh" : isMobile ? "auto" : "250vh",
        opacity: hydrated ? 1 : 0,
      }}
    >
      <div
        className={
          isMobile
            ? "relative bg-black px-6 py-16"
            : "sticky top-0 h-screen flex flex-col items-center justify-center px-6"
        }
      >
        {/* Ballpit canvas — behind the Venn content */}
        {vennFillDone && (
          <div className="absolute inset-0 z-0">
            <Ballpit
              count={150}
              gravity={1.8}
              minSize={0.4}
              maxSize={0.7}
              size0={0.3}
              lightIntensity={100}
              friction={0.956}
              wallBounce={0.95}
              followCursor
              explode
              colors={["#b2d6f7", "#9ebcdd", "#738ba0", "#5f7d99"]}
            />
          </div>
        )}
        <div className="relative z-10 max-w-5xl w-full mx-auto">
          <TaglineReveal onComplete={handleTaglineDone} />
          <VennDiagram
            progress={progress}
            visible={taglineDone}
            isMobile={isMobile ?? false}
            onFillComplete={handleFillComplete}
          />
        </div>
      </div>
    </div>
  );
}
