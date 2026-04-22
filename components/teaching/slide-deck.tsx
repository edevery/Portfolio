"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type Slide =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

interface SlideDeckProps {
  slides: Slide[];
  title?: string;
}

export function SlideDeck({ slides, title }: SlideDeckProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const el = thumbRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [index]);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, total]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total]);

  const slide = slides[index];

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col overflow-hidden">
      <div className="absolute top-6 md:top-8 left-6 md:left-8 z-20 flex items-center gap-1 md:gap-1.5 max-w-[calc(100vw-9rem)] flex-wrap">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 w-1 md:h-1.5 md:w-1.5 rounded-full transition-all duration-200 ${
              i === index
                ? "bg-white scale-125"
                : i < index
                  ? "bg-white/60 hover:bg-white/80"
                  : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 text-xs md:text-sm text-white/60 tabular-nums pointer-events-none">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center px-6 md:px-20 pt-20 pb-4">
        <div className="relative w-[90%] max-w-[1440px] aspect-video">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 rounded-lg md:rounded-xl overflow-hidden bg-black border border-white/20"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) next();
                else if (info.offset.x > 80) prev();
              }}
            >
              {slide.type === "image" ? (
                <Image
                  src={slide.src}
                  alt={slide.alt ?? `Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 1600px"
                  className="object-contain select-none"
                  draggable={false}
                />
              ) : (
                <video
                  key={slide.src}
                  src={slide.src}
                  poster={slide.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous slide"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 md:h-14 md:w-14 rounded-full border border-white/15 bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        disabled={index === total - 1}
        aria-label="Next slide"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 md:h-14 md:w-14 rounded-full border border-white/15 bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="shrink-0 z-20 pt-4 pb-6">
        <div className="overflow-x-auto no-scrollbar mx-auto px-6 md:px-12 py-1.5">
          <div className="flex items-center gap-2 md:gap-3 w-max mx-auto">
            {slides.map((s, i) => {
              const posterSrc = s.type === "image" ? s.src : s.poster;
              return (
                <button
                  key={i}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Jump to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 aspect-video h-14 md:h-16 ${
                    i === index
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black opacity-100"
                      : "opacity-50 hover:opacity-90 ring-1 ring-white/10"
                  }`}
                >
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt={`Slide ${i + 1} thumbnail`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-[10px] text-white/60">
                      {i + 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
