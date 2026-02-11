"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const LINE_1 = "Designing at the intersection of";
const LINE_2 = "brand, product, and emerging technology";

const WORDS_1 = LINE_1.split(" ");
const WORDS_2 = LINE_2.split(" ");

// Total character count across both lines (for stagger limit)
const TOTAL_CHARS = (LINE_1 + LINE_2).replace(/ /g, "").length;

const STAGGER_MS = 20;
const INITIAL_DELAY_MS = 200;

// Build a global char index offset for each word
function charOffsets(words: string[]) {
  let offset = 0;
  return words.map((word) => {
    const o = offset;
    offset += word.length;
    return o;
  });
}

const OFFSETS_1 = charOffsets(WORDS_1);
const OFFSETS_2 = charOffsets(WORDS_2);
const LINE_1_CHAR_COUNT = LINE_1.replace(/ /g, "").length;

// No accent-colored words
const BLUE_WORDS = new Set<number>();

interface TaglineRevealProps {
  onComplete?: () => void;
}

export function TaglineReveal({ onComplete }: TaglineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-200px" });
  const [revealedCount, setRevealedCount] = useState(-1);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => setRevealedCount(0), INITIAL_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isInView]);

  useEffect(() => {
    if (revealedCount < 0 || revealedCount >= TOTAL_CHARS - 1) return;
    const timeout = setTimeout(
      () => setRevealedCount((c) => c + 1),
      STAGGER_MS,
    );
    return () => clearTimeout(timeout);
  }, [revealedCount]);

  // Fire onComplete when the last character has been revealed
  useEffect(() => {
    if (revealedCount >= TOTAL_CHARS - 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [revealedCount, onComplete]);

  return (
    <div
      ref={containerRef}
      className="description-container pb-6 flex items-center justify-center"
    >
      <p
        className="text-center max-w-4xl text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-[#efefef]"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
      >
        {WORDS_1.map((word, wi) => (
          <span key={wi} className="description-word inline-block mr-[0.15em]">
            {word.split("").map((char, ci) => {
              const globalIndex = OFFSETS_1[wi] + ci;
              return (
                <motion.span
                  key={ci}
                  className="inline-block"
                  initial={{ opacity: 0, filter: "blur(8px)", x: -6, textShadow: "0 0 0px rgba(133,195,237,0)" }}
                  animate={
                    globalIndex <= revealedCount
                      ? { opacity: 1, filter: "blur(0px)", x: 0, textShadow: "0 0 20px rgba(133,195,237,0.3)" }
                      : { opacity: 0, filter: "blur(8px)", x: -6, textShadow: "0 0 0px rgba(133,195,237,0)" }
                  }
                  transition={{
                    duration: 1.0,
                    ease: [0.05, 0.6, 0.3, 0.98],
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
        <br />
        {WORDS_2.map((word, wi) => (
          <span
            key={wi}
            className="description-word inline-block mr-[0.15em]"
            style={BLUE_WORDS.has(wi) ? { color: "var(--color-accent)" } : undefined}
          >
            {word.split("").map((char, ci) => {
              const globalIndex = LINE_1_CHAR_COUNT + OFFSETS_2[wi] + ci;
              return (
                <motion.span
                  key={ci}
                  className="inline-block"
                  initial={{ opacity: 0, filter: "blur(8px)", x: -6, textShadow: "0 0 0px rgba(133,195,237,0)" }}
                  animate={
                    globalIndex <= revealedCount
                      ? { opacity: 1, filter: "blur(0px)", x: 0, textShadow: "0 0 20px rgba(133,195,237,0.3)" }
                      : { opacity: 0, filter: "blur(8px)", x: -6, textShadow: "0 0 0px rgba(133,195,237,0)" }
                  }
                  transition={{
                    duration: 1.0,
                    ease: [0.05, 0.6, 0.3, 0.98],
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </p>
    </div>
  );
}
