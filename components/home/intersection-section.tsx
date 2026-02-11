"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { TaglineReveal } from "./tagline-reveal";
import { VennDiagram } from "./venn-diagram";

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

export function IntersectionSection() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [progress, setProgress] = useState(0);
  const [taglineDone, setTaglineDone] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

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
            ? "bg-black px-6 py-16"
            : "sticky top-0 h-screen flex flex-col items-center justify-center px-6"
        }
      >
        <div className="max-w-5xl w-full mx-auto">
          <TaglineReveal onComplete={() => setTaglineDone(true)} />
          <VennDiagram
            progress={progress}
            visible={taglineDone}
            isMobile={isMobile ?? false}
          />
        </div>
      </div>
    </div>
  );
}
