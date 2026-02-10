"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import type { WorkItem } from "@/lib/work-data";
import { VestaLogoAnimated } from "./vesta-logo-animated";

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface CaseStudyHeroProps {
  item: WorkItem;
}

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function CaseStudyHero({ item }: CaseStudyHeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Responsive inset and border radius
  const inset = isMobile ? 16 : 48;
  const radius = isMobile ? 16 : 24;

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Hero container - animates inset from edges */}
      <motion.div
        className="absolute overflow-hidden"
        initial={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 0,
        }}
        animate={{
          top: inset,
          left: inset,
          right: inset,
          bottom: inset,
          borderRadius: radius,
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0, 1],
          delay: 0.4,
        }}
      >
        {item.heroMedia.type === "video" ? (
          <>
            <motion.video
              ref={videoRef}
              src={item.heroMedia.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2,
              }}
            />
            {/* Sound toggle button - hidden on mobile */}
            {!isMobile && (
              <motion.button
                onClick={toggleMute}
                className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 transition-colors hover:bg-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                <SoundIcon muted={isMuted} />
              </motion.button>
            )}
          </>
        ) : (
          <motion.img
            src={item.heroMedia.src}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0, 1],
              delay: 0.2,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Vesta animated logo overlay */}
        {item.slug === "vesta" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <VestaLogoAnimated className="w-[60%] max-w-[500px] drop-shadow-2xl" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
