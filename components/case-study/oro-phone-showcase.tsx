"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface PhoneCard {
  title: string;
  description: string;
  videoSrc: string;
  poster?: string;
}

interface OroPhoneShowcaseProps {
  cards: [PhoneCard, PhoneCard];
}

const PHONE_ASPECT = "1206 / 2622";

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

function PhoneVideoFrame({ src, poster }: { src: string; poster?: string }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        aspectRatio: PHONE_ASPECT,
        // x-radius is % of width, y-radius is % of height — keep both equal in px
        // for aspect 1206/2622 (~0.46): 11% of W ≈ 5.06% of H
        borderRadius: "clamp(20px, 11%, 48px) / clamp(20px, 5.06%, 48px)",
        border: "2px solid #ffffff",
      }}
    >
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

function DesktopCard({ card }: { card: PhoneCard }) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(140);

  useEffect(() => {
    if (contentRef.current) {
      const h = contentRef.current.offsetHeight + 32;
      setContentHeight(Math.max(h, 120));
    }
  }, [card.title, card.description]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4]"
      style={{
        backgroundColor: isHovered ? "#062235" : "#141414",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute flex items-center justify-center"
        animate={{
          top: 32,
          left: 0,
          right: 0,
          bottom: isHovered ? contentHeight : 32,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div style={{ height: "79%", aspectRatio: PHONE_ASPECT }}>
          <PhoneVideoFrame src={card.videoSrc} poster={card.poster} />
        </div>
      </motion.div>

      <motion.div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 px-6 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3
          className="text-xs font-bold tracking-wider uppercase mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "#feb146" }}
        >
          {card.title}
        </h3>
        <p
          className="text-sm md:text-base text-white/80 leading-relaxed text-balance"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {card.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function MobileCard({ card }: { card: PhoneCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-center pt-8 pb-6">
          <div style={{ width: "52%" }}>
            <PhoneVideoFrame src={card.videoSrc} poster={card.poster} />
          </div>
        </div>
        <div className="px-5 pb-5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#feb146" }}
          >
            {card.title}
          </h3>
          <p
            className="text-sm text-white/70 leading-relaxed text-balance"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {card.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function OroPhoneShowcase({ cards }: OroPhoneShowcaseProps) {
  const isMobile = useIsMobile();
  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="bg-black px-4 pt-0 pb-6 space-y-6">
        {cards.map((c) => (
          <MobileCard key={c.title} card={c} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-black mx-12 pt-0 pb-4">
      <div className="grid grid-cols-2 gap-4 items-start">
        {cards.map((c) => (
          <DesktopCard key={c.title} card={c} />
        ))}
      </div>
    </div>
  );
}
