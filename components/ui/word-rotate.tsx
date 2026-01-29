"use client";

import { AnimatePresence, motion, TargetAndTransition, Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
  framerProps?: {
    initial?: TargetAndTransition;
    animate?: TargetAndTransition;
    exit?: TargetAndTransition;
    transition?: Transition;
  };
}

export function WordRotate({
  words,
  duration = 2500,
  className,
  framerProps = {
    initial: { opacity: 0, rotateX: -90, y: -10 },
    animate: { opacity: 1, rotateX: 0, y: 0 },
    exit: { opacity: 0, rotateX: 90, y: 10 },
    transition: { duration: 0.35, ease: "easeOut" },
  },
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className="overflow-hidden inline-block" style={{ perspective: "500px" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={framerProps.initial}
          animate={framerProps.animate}
          exit={framerProps.exit}
          transition={framerProps.transition}
          className={cn("inline-block origin-center", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
