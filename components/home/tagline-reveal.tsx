"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const LINES = [
  "Creating continuity between brand and product,",
  "where identity, voice, interface, and behavior",
  "carry through as one system.",
];

const WORDS_PER_LINE = LINES.map((l) => l.split(" "));
const TOTAL_CHARS = LINES.join("").replace(/ /g, "").length;

const STAGGER_MS = 20;
const INITIAL_DELAY_MS = 200;

// Build a global char index offset for each word, across all lines
function buildOffsets(lines: string[][]): { wordOffsets: number[][]; lineStarts: number[] } {
  const wordOffsets: number[][] = [];
  const lineStarts: number[] = [];
  let global = 0;
  for (const words of lines) {
    lineStarts.push(global);
    const offsets: number[] = [];
    for (const word of words) {
      offsets.push(global);
      global += word.length;
    }
    wordOffsets.push(offsets);
  }
  return { wordOffsets, lineStarts };
}

const { wordOffsets: WORD_OFFSETS } = buildOffsets(WORDS_PER_LINE);

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
        {WORDS_PER_LINE.map((words, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            {words.map((word, wi) => (
              <span key={wi} className="description-word inline-block mr-[0.15em]">
                {word.split("").map((char, ci) => {
                  const globalIndex = WORD_OFFSETS[li][wi] + ci;
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
          </Fragment>
        ))}
      </p>
    </div>
  );
}
