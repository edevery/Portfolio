"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface OroTabletShowcaseProps {
  title: string;
  description: string;
  videoSrc: string;
  mobileVideoSrc?: string;
  poster?: string;
  compact?: boolean;
}

const TABLET_ASPECT = "16 / 9";

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

function TabletVideoFrame({ src, poster }: { src: string; poster?: string }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        aspectRatio: TABLET_ASPECT,
        // x-radius is % of width, y-radius is % of height — keep both equal in px
        // for aspect 16/9 (0.5625): 2.5% of W = 4.44% of H
        borderRadius: "clamp(12px, 2.5%, 28px) / clamp(12px, 4.44%, 28px)",
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

function DesktopCard({ title, description, videoSrc, poster }: { title: string; description: string; videoSrc: string; poster?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(140);

  useEffect(() => {
    if (contentRef.current) {
      const h = contentRef.current.offsetHeight + 32;
      setContentHeight(Math.max(h, 120));
    }
  }, [title, description]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[16/11]"
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
        <div style={{ width: "85%", aspectRatio: TABLET_ASPECT }}>
          <TabletVideoFrame src={videoSrc} poster={poster} />
        </div>
      </motion.div>

      <motion.div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 px-8 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3
          className="text-xs font-bold tracking-wider uppercase mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "#feb146" }}
        >
          {title}
        </h3>
        <p
          className="text-sm md:text-base text-white/80 leading-relaxed text-balance max-w-3xl"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function MobileCard({ title, description, videoSrc, poster }: { title: string; description: string; videoSrc: string; poster?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-center pt-6 pb-5 px-5">
          <div style={{ width: "100%" }}>
            <TabletVideoFrame src={videoSrc} poster={poster} />
          </div>
        </div>
        <div className="px-5 pb-5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#feb146" }}
          >
            {title}
          </h3>
          <p
            className="text-sm text-white/70 leading-relaxed text-balance"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function OroTabletShowcase({ title, description, videoSrc, mobileVideoSrc, poster, compact = false }: OroTabletShowcaseProps) {
  const isMobile = useIsMobile();
  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className={`bg-black px-4 pt-0 ${compact ? "pb-6" : "pb-16"}`}>
        <MobileCard title={title} description={description} videoSrc={mobileVideoSrc || videoSrc} poster={poster} />
      </div>
    );
  }

  return (
    <div className={`bg-black mx-12 pt-0 ${compact ? "pb-4" : "pb-24"}`}>
      <DesktopCard title={title} description={description} videoSrc={videoSrc} poster={poster} />
    </div>
  );
}
