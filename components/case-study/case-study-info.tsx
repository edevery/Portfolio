"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDragSnap } from "@/lib/use-drag-snap";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import { workItems, type WorkItem } from "@/lib/work-data";
import { BLOB_BASE } from "@/lib/utils";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { TransitionLink } from "@/components/case-study/transition-link";

interface CaseStudyInfoProps {
  item: WorkItem;
}

// Calculate rotation based on mouse position relative to element center
const calcRotation = (x: number, y: number, rect: DOMRect) => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rotateX = ((y - centerY) / (rect.height / 2)) * -15;
  const rotateY = ((x - centerX) / (rect.width / 2)) * 15;
  return [rotateX, rotateY];
};

// It All Starts Here - Video with sound toggle (client-only to avoid hydration mismatch)
function ItAllStartsHereVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- hydration-safe mount guard
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="px-6 md:px-12 mt-4 md:mt-6">
      <div className="relative overflow-hidden rounded-2xl aspect-video bg-black">
        {mounted && (
          <>
            <video
              ref={videoRef}
              src={`${BLOB_BASE}/Work/ItAllStartsHere/Video_optimized.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 transition-colors hover:bg-white/20"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Vesta Onboarding Content Component with staggered entrance animations
function VestaOnboardingContent() {
  const columns = [
    {
      title: "Relationship Context",
      content: "Vesta adjusts its tone and content based on the couple's relationship duration and living dynamic, recognizing that a 6-month relationship and a 6-year one require different forms of support.",
    },
    {
      title: "Location",
      content: "Location awareness enables Vesta to suggest contextually relevant date ideas, from nearby restaurants to weekend getaways. The app adapts to users' surroundings while respecting privacy preferences.",
    },
    {
      title: "Emotional Frameworks",
      content: "Vesta recognizes that partners express love differently: through quality time, words of affirmation, acts of service, physical touch, or gifts. This understanding allows tailored suggestions for each unique relationship dynamic.",
    },
  ];

  const { containerRef, x, cardWidth, dragProps } = useDragSnap({
    itemCount: columns.length,
    cardWidthFraction: 0.8,
  });

  return (
    <div className="relative z-10 bg-black">
      {/* Desktop Layout */}
      <section className="hidden md:block mx-12 pt-8 pb-6">
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          {/* Intro text */}
          <motion.p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl mb-16"
            style={{ fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            Vesta&apos;s onboarding uses reflective prompts to understand how users love and connect. Relationship duration, location, love language, and attachment style personalize every experience that follows.
          </motion.p>

          {/* Three column grid with staggered animations */}
          <div className="grid grid-cols-3 gap-12">
            {columns.map((column, index) => (
              <motion.div
                key={column.title}
                className={`${index > 0 ? "border-l border-[#85c3ed]/30 pl-8" : ""}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                  delay: index * 0.2,
                }}
              >
                <motion.h3
                  className="text-xs font-bold tracking-wider uppercase mb-4"
                  style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    delay: index * 0.2 + 0.1,
                  }}
                >
                  {column.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-white/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                  initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                    delay: index * 0.2 + 0.2,
                  }}
                >
                  {column.content}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Layout - Carousel only (intro text moved above Question2.png) */}
      <section className="block md:hidden pt-6 pb-4">
        {/* Swipe Carousel */}
        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
            style={{ x, touchAction: "pan-y pinch-zoom" }}
            {...dragProps}
          >
            {columns.map((column) => (
              <motion.div
                key={column.title}
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <div className="rounded-2xl p-5 border border-white/20 h-full">
                  <h3
                    className="text-xs font-bold tracking-wider uppercase mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                  >
                    {column.title}
                  </h3>
                  <p
                    className="text-sm text-white/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {column.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Mobile Brand Elements data
const mobileBrandElements = [
  {
    image: "/Work/Vesta/Mobile/Moodboard.png",
    title: "Mood Board",
    description: "I was inspired by classical murals in the Louvre and Roman sculptures of gods and goddesses, delicate serif typography, and fire-like gradients to express love as both timeless and luminous.",
  },
  {
    image: "/Work/Vesta/Mobile/Colors.png",
    title: "Color Palette",
    description: "The warm reds and golds balance the cool blues to convey both passion and ease.",
  },
  {
    image: "/Work/Vesta/Mobile/Gradients.png",
    title: "Gradients",
    description: "I created custom CSS mesh gradients for a modern sense of light and warmth. Inspired by flames, designed to feel calm, fluid, and alive within the app experience.",
  },
  {
    image: "/Work/Vesta/Mobile/Typography.png",
    title: "Typography",
    description: "I paired Bugari, inspired by Roman engravings to bring a sense of timeless reverence, with Inter for its modern clarity.",
  },
  {
    image: "/Work/Vesta/Mobile/Wordmark.png",
    title: "Logo",
    description: "I customized the logotype to overlap the e-s and t-a. A subtle adjustment to make the letters feel close and connected.",
  },
];

// Mobile Vesta Brand Elements - swipe carousel
function MobileVestaBrandElements() {
  const { containerRef, x, cardWidth, dragProps } = useDragSnap({
    itemCount: mobileBrandElements.length,
    cardWidthFraction: 0.85,
  });

  return (
    <div className="bg-black pt-8 pb-0">
      {/* Carousel */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing items-stretch"
          style={{ x, touchAction: "pan-y pinch-zoom" }}
          {...dragProps}
        >
          {mobileBrandElements.map((item) => (
            <motion.div
              key={item.title}
              className="flex-shrink-0 flex"
              style={{ width: cardWidth }}
            >
              <div className="bg-[#141414] rounded-2xl overflow-hidden flex flex-col w-full">
                {/* Image with fixed height container */}
                <div className="relative h-[400px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                    draggable={false}
                  />
                </div>

                {/* Text content at bottom - fixed height */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3
                    className="text-xs font-bold tracking-wider uppercase mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-white/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Desktop Vesta Brand Elements Carousel Component
// Hover card for brand elements grid - expands on hover to reveal text
function BrandElementCard({ item, className }: { item: { image: string; title: string; description: string }; className?: string }) {
  return (
    <motion.div
      className={`overflow-hidden rounded-2xl ${className || ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Image
        src={item.image}
        alt={item.title}
        width={1920}
        height={1080}
        className="w-full h-auto"
        draggable={false}
      />
    </motion.div>
  );
}

function DesktopVestaBrandElements() {
  const moodboard = {
    image: "/Work/Vesta/Vesta/BrandSystem4.png",
    title: "Mood Board",
    description: "I was inspired by classical murals in the Louvre and Roman sculptures of gods and goddesses, delicate serif typography, and fire-like gradients to express love as both timeless and luminous.",
  };

  const gridElements = [
    {
      image: "/Work/Vesta/Vesta/BrandSystem1.png",
      title: "Color Palette",
      description: "The warm reds and golds balance the cool blues to convey both passion and ease.",
    },
    {
      image: "/Work/Vesta/Vesta/BrandSystem3.png",
      title: "Typography",
      description: "I paired Bugari, inspired by Roman engravings to bring a sense of timeless reverence, with Inter for its modern clarity.",
    },
    {
      image: "/Work/Vesta/Vesta/BrandSystem2.png",
      title: "Gradients",
      description: "I created custom CSS mesh gradients for a modern sense of light and warmth. Inspired by flames, designed to feel calm, fluid, and alive within the app experience.",
    },
  ];

  return (
    <div className="relative z-20 bg-black">
      <div className="mx-12 pt-0 pb-12 space-y-4">
        {/* Mood Board - full width at top */}
        <BrandElementCard item={moodboard} />

        {/* 3-column grid: Color Palette, Typography, Gradients */}
        <div className="grid grid-cols-3 gap-4">
          {gridElements.map((item) => (
            <BrandElementCard key={item.title} item={item} />
          ))}
        </div>

        {/* Brand System description card */}
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          <motion.p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl mb-16"
            style={{ fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            I was inspired by classical murals in the Louvre and Roman sculptures of gods and goddesses, delicate serif typography, and fire-like gradients to express love as both timeless and luminous. Vesta, Roman goddess of the hearth, became the brand&apos;s soul.
          </motion.p>

          <div className="grid grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                Color Palette
              </h3>
              <p
                className="text-base text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Warm reds and golds counterbalance cool blues, creating a sense of passion held in calm.
              </p>
            </motion.div>

            <motion.div
              className="border-l border-[#85c3ed]/30 pl-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            >
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                Gradients
              </h3>
              <p
                className="text-base text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Custom CSS Gradients bring a modern sense of light and warmth.
              </p>
            </motion.div>

            <motion.div
              className="border-l border-[#85c3ed]/30 pl-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
            >
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                Typography
              </h3>
              <p
                className="text-base text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Inspired by Roman engravings, Bugari brings timeless reverence, balanced by Inter&apos;s modern clarity.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vesta Brand Elements wrapper - switches between mobile and desktop
function VestaBrandElements() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show nothing during SSR/hydration to avoid mismatch
  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileVestaBrandElements />;
  }

  return <DesktopVestaBrandElements />;
}

// Vesta Reflection Component - final section with video + card (styled like Personalized Nudges)
// Mobile Vesta Reflection - text card first, then video
function MobileVestaReflection() {
  return (
    <div id="vesta-reflection" className="relative z-20 bg-black pt-8 pb-16">
      {/* Reflection card - same format as Personalized Nudges */}
      <motion.div
        className="mx-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Reflection
          </h3>
          <p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Vesta is the culmination of years spent designing systems that bridge logic and emotion. At agencies, I&apos;ve helped brands craft stories that connect people to ideas. With Vesta, I wanted to design something that connects people. It reminded me why I design: to make empathy scalable, to turn intention into action, and to build tools that help love last.
          </p>
        </div>
      </motion.div>

      {/* Video below card */}
      <div className="mx-4">
        <video
          src={`${BLOB_BASE}/Work/Vesta/Vesta/Reflection.mp4`}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </div>
  );
}

// Desktop Vesta Reflection - video then card (styled like Personalized Nudges)
function DesktopVestaReflection() {
  return (
    <div id="vesta-reflection" className="relative z-20 bg-black pb-24">
      {/* Video - same width as card below (mx-12) */}
      <div className="mx-12 mb-16">
        <video
          src={`${BLOB_BASE}/Work/Vesta/Vesta/Reflection.mp4`}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-2xl"
        />
      </div>

      {/* Reflection card - same format as Personalized Nudges */}
      <motion.div
        className="bg-black mx-12 pb-12"
        initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Reflection
          </h3>
          <p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Vesta is the culmination of years spent designing systems that bridge logic and emotion. At agencies, I&apos;ve helped brands craft stories that connect people to ideas. With Vesta, I wanted to design something that connects people. It reminded me why I design: to make empathy scalable, to turn intention into action, and to build tools that help love last.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Vesta Reflection wrapper - switches between mobile and desktop
function VestaReflection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show nothing during SSR/hydration to avoid mismatch
  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileVestaReflection />;
  }

  return <DesktopVestaReflection />;
}

// Mobile Sections Carousel Component
interface MobileSectionsCarouselProps {
  item: WorkItem;
  renderWithItalics: (text: string) => React.ReactNode;
}

function MobileSectionsCarousel({ item, renderWithItalics }: MobileSectionsCarouselProps) {
  const { containerRef, x, cardWidth, dragProps } = useDragSnap({
    itemCount: item.sections.length,
    cardWidthFraction: 0.85,
  });

  return (
    <div className="block md:hidden bg-black py-8">
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
          style={{ x, touchAction: "pan-y pinch-zoom" }}
          {...dragProps}
        >
          {item.sections.map((section) => {
            const content = section.content || "";
            const paragraphs = content.split("\n\n");
            const firstParagraph = paragraphs[0];
            const restParagraphs = paragraphs.slice(1).join("\n\n");

            return (
              <motion.div
                key={section.id}
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 h-full flex flex-col">
                  {/* Section Label */}
                  <h3
                    className="text-xs font-bold tracking-wider uppercase mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                  >
                    {section.label}
                  </h3>

                  {/* Divider line */}
                  <div
                    className="w-full h-px mb-4"
                    style={{
                      background: "linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                    }}
                  />

                  {/* Section Content */}
                  <div className="flex-1">
                    <p
                      className="text-base text-white/70 leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {renderWithItalics(firstParagraph)}
                    </p>

                    {restParagraphs && (
                      <p
                        className="mt-4 text-base text-white/70 leading-relaxed whitespace-pre-line"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {renderWithItalics(restParagraphs)}
                      </p>
                    )}
                  </div>

                  {/* Link button if present */}
                  {section.link && (
                    <a
                      href={section.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-white/10 hover:bg-[#16588E] rounded-full text-white text-sm font-medium transition-colors duration-200 self-start"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {section.linkLabel || "Learn More"}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// Explore More Work Component - shows next projects with square thumbnails
function ExploreMoreWork({ currentItem }: { currentItem: WorkItem }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Find current item index and get next 2 projects (wrapping to beginning)
  const currentIndex = workItems.findIndex((item) => item.slug === currentItem.slug);
  const nextProjects = [
    workItems[(currentIndex + 1) % workItems.length],
    workItems[(currentIndex + 2) % workItems.length],
  ];

  return (
    <div className="relative z-20 bg-black px-6 md:px-12 lg:px-24 pb-32 md:pb-48">
      {/* Divider Line - tapered gradient */}
      <div
        className="w-full max-w-3xl mx-auto h-px mb-20 md:mb-28"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Project Thumbnails - Square */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nextProjects.map((project, index) => (
            <TransitionLink
              key={project.id}
              href={`/work/${project.slug}`}
              className="block"
            >
              <motion.div
                className="relative overflow-hidden rounded-xl cursor-pointer aspect-square bg-[#1e1e1e]"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Project Image - contracts on hover */}
                <motion.div
                  className="absolute overflow-hidden rounded-lg"
                  animate={{
                    top: hoveredIndex === index ? 12 : 0,
                    left: hoveredIndex === index ? 12 : 0,
                    right: hoveredIndex === index ? 12 : 0,
                    bottom: hoveredIndex === index ? 140 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Content that reveals on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 px-4 pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-white text-lg lg:text-xl font-semibold tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 text-xs rounded-full bg-transparent border border-white/20 text-white/90"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </div>
  );
}

// Instacart Color Palette Component
function InstacartColorPalette() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const colors = [
    // Top row
    { name: "Blueberry Pie", hex: "#5D7087" },
    { name: "Tomato Bisque", hex: "#D47665" },
    { name: "Pumpkin Pie", hex: "#E2A262" },
    { name: "Whipped Cream", hex: "#FAEFDE" },
    { name: "Strawberry Ice Cream", hex: "#C79598" },
    { name: "Lemon Cake", hex: "#E6D06E" },
    { name: "Crispy Kale", hex: "#00573D" },
    { name: "Key Lime Pie", hex: "#7CB369" },
    // Bottom row
    { name: "Blackberry Cobbler", hex: "#4A5568" },
    { name: "Beef Bolognese", hex: "#9E5A50" },
    { name: "Candied Yam", hex: "#A66626" },
    { name: "Vanilla Bean", hex: "#F7E6CD" },
    { name: "Glazed Ham", hex: "#AA5D62" },
    { name: "Short Ribs", hex: "#8B5D42" },
    { name: "Roasted Broccoli", hex: "#2D5A3D" },
    { name: "Pickled Jalapeno", hex: "#709449" },
  ];

  // Determine if text should be light or dark based on background
  const isLightColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className="relative z-20 bg-black px-6 md:px-12 mt-4 md:mt-6">
      <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
        {/* Color Grid */}
        <div className="overflow-visible rounded-2xl">
          {/* Two rows with gap */}
          <div className="grid grid-rows-2 gap-2">
            {/* Top row */}
            <div className="grid grid-cols-8 gap-2">
              {colors.slice(0, 8).map((color, index) => (
                <motion.div
                  key={color.name}
                  className="relative aspect-[1/1.2] cursor-pointer rounded-lg overflow-hidden"
                  style={{ backgroundColor: color.hex, willChange: "transform" }}
                  onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: hoveredIndex === index ? 1.15 : 1,
                    zIndex: hoveredIndex === index ? 10 : 1,
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Hover overlay with name and hex - desktop only */}
                  <motion.div
                    className="absolute inset-0 hidden md:flex flex-col items-center justify-center p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="text-[8px] font-medium tracking-wider uppercase text-center leading-tight mb-1"
                      style={{
                        fontFamily: "var(--font-inter)",
                        color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                      }}
                    >
                      {color.name.split(" ").slice(0, 1).join(" ")}<br />
                      {color.name.split(" ").slice(1).join(" ")}
                    </span>
                    <span
                      className="text-[8px] font-mono"
                      style={{
                        color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                        opacity: 0.7,
                      }}
                    >
                      {color.hex}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            {/* Bottom row */}
            <div className="grid grid-cols-8 gap-2">
              {colors.slice(8, 16).map((color, index) => (
                <motion.div
                  key={color.name}
                  className="relative aspect-[1/1.2] cursor-pointer rounded-lg overflow-hidden"
                  style={{ backgroundColor: color.hex, willChange: "transform" }}
                  onClick={() => setHoveredIndex(hoveredIndex === index + 8 ? null : index + 8)}
                  onMouseEnter={() => setHoveredIndex(index + 8)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: hoveredIndex === index + 8 ? 1.15 : 1,
                    zIndex: hoveredIndex === index + 8 ? 10 : 1,
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Hover overlay with name and hex - desktop only */}
                  <motion.div
                    className="absolute inset-0 hidden md:flex flex-col items-center justify-center p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index + 8 ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="text-[8px] font-medium tracking-wider uppercase text-center leading-tight mb-1"
                      style={{
                        fontFamily: "var(--font-inter)",
                        color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                      }}
                    >
                      {color.name.split(" ").slice(0, 1).join(" ")}<br />
                      {color.name.split(" ").slice(1).join(" ")}
                    </span>
                    <span
                      className="text-[8px] font-mono"
                      style={{
                        color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                        opacity: 0.7,
                      }}
                    >
                      {color.hex}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile tap overlay */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setHoveredIndex(null)}
            >
              <div className="absolute inset-0 bg-black/80" />
              <motion.div
                className="relative flex flex-col items-center gap-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className="w-28 h-28 rounded-2xl"
                  style={{ backgroundColor: colors[hoveredIndex].hex }}
                />
                <div className="text-center">
                  <p
                    className="text-sm font-medium tracking-wider uppercase text-white"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {colors[hoveredIndex].name}
                  </p>
                  <p
                    className="text-sm font-mono text-white/60 mt-1"
                  >
                    {colors[hoveredIndex].hex}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <h3
          className="text-xs font-bold tracking-wider uppercase mb-3 mt-10"
          style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
        >
          Color Palette
        </h3>
        <p
          className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Reminiscent of a home-cooked meal
        </p>
        <p
          className="text-[10px] text-white/30 mt-2 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Click around
        </p>
      </div>
    </div>
  );
}

// Link Logistics Color Palette Component
function LinkLogisticsColorPalette() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Colors eyedropped from reference image
  // borderRadius: each swatch has one curved corner
  const colors = [
    { name: "Solar", hex: "#8BAAB8", gridArea: "solar", borderRadius: "0 12px 0 0" },
    { name: "Site", hex: "#C4A55E", gridArea: "site", borderRadius: "12px 0 0 0" },
    { name: "Rust", hex: "#B5674A", gridArea: "rust", borderRadius: "0 12px 0 0" },
    { name: "Freight", hex: "#E57B68", gridArea: "freight", borderRadius: "12px 0 0 0" },
    { name: "White", hex: "#FFFFFF", gridArea: "white", borderRadius: "0 12px 0 0" },
    { name: "Pipeline", hex: "#E5968A", gridArea: "pipeline", borderRadius: "12px 0 0 0" },
    { name: "Cement", hex: "#E5E1DA", gridArea: "cement", borderRadius: "0 0 0 12px" },
    { name: "Slate", hex: "#3C3F44", gridArea: "slate", borderRadius: "0 0 12px 0" },
    { name: "Cardboard", hex: "#DBBFA0", gridArea: "cardboard", borderRadius: "12px 0 0 0" },
  ];

  // Determine if text should be light or dark based on background
  const isLightColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className="relative z-20 bg-black px-6 md:px-12 mt-4 md:mt-6">
      <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
        {/* Color Grid - Custom L-shaped layout */}
        <div className="overflow-visible">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr 1fr 1fr",
              gridTemplateRows: "120px 120px 120px",
              gridTemplateAreas: `
                "solar site rust freight white pipeline"
                "cement slate slate slate slate slate"
                "cardboard slate slate slate slate slate"
              `,
            }}
          >
            {colors.map((color, index) => (
              <motion.div
                key={color.name}
                className="relative cursor-pointer overflow-hidden"
                style={{
                  backgroundColor: color.hex,
                  gridArea: color.gridArea,
                  borderRadius: color.borderRadius,
                  willChange: "transform",
                }}
                onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: hoveredIndex === index ? 1.18 : 1,
                  zIndex: hoveredIndex === index ? 10 : 1,
                }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Hover overlay with name and hex - desktop only */}
                <motion.div
                  className="absolute inset-0 hidden md:flex flex-col items-center justify-center p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className="text-xs md:text-sm font-medium tracking-wider uppercase text-center leading-tight mb-1"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                    }}
                  >
                    {color.name}
                  </span>
                  <span
                    className="text-xs md:text-sm font-mono"
                    style={{
                      color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                      opacity: 0.7,
                    }}
                  >
                    {color.hex}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile tap overlay */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setHoveredIndex(null)}
            >
              <div className="absolute inset-0 bg-black/80" />
              <motion.div
                className="relative flex flex-col items-center gap-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className="w-28 h-28 rounded-2xl"
                  style={{ backgroundColor: colors[hoveredIndex].hex }}
                />
                <div className="text-center">
                  <p
                    className="text-sm font-medium tracking-wider uppercase text-white"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {colors[hoveredIndex].name}
                  </p>
                  <p
                    className="text-sm font-mono text-white/60 mt-1"
                  >
                    {colors[hoveredIndex].hex}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <h3
          className="text-xs font-bold tracking-wider uppercase mb-3 mt-10"
          style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
        >
          Color Palette
        </h3>
        <p
          className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Muted palette inspired by industrial photography
        </p>
      </div>
    </div>
  );
}

// Vesta Guiding Personas Component with scroll-driven carousel
// Persona images data - shared between mobile and desktop
const personaImages = [
  "/Work/Vesta/Vesta/UserPersona-1.png",
  "/Work/Vesta/Vesta/UserPersona-2.png",
  "/Work/Vesta/Vesta/UserPersona-3.png",
];

// Mobile Guiding Personas - simple swipe carousel
function MobileVestaGuidingPersonas() {
  const { containerRef, x, cardWidth, dragProps } = useDragSnap({
    itemCount: personaImages.length,
    cardWidthFraction: 0.85,
  });

  return (
    <div className="relative z-20 bg-black px-4 pt-8 pb-0">
      {/* Header card - styled to match Reflection card */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Guiding Personas
          </h3>
          <p
            className="text-2xl text-white/80 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Three personas representing different relationship challenges shaped Vesta&apos;s gentle tone and calendar integration.
          </p>
        </div>
      </motion.div>

      {/* Simple Carousel */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
          style={{ x, touchAction: "pan-y pinch-zoom" }}
          {...dragProps}
        >
          {personaImages.map((image, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
            >
              <Image
                src={image}
                alt={`User Persona ${index + 1}`}
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl"
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Desktop Guiding Personas - 3-column grid with description card
function DesktopVestaGuidingPersonas() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="relative z-20 bg-black">
      {/* 3-column grid of persona images */}
      <div className="mx-12 py-12">
        <div className="grid grid-cols-3 gap-4">
          {personaImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.1 }}
              onClick={() => setExpandedIndex(index)}
              className="cursor-pointer"
            >
              <Image
                src={image}
                alt={`User Persona ${index + 1}`}
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl transition-transform duration-300 hover:scale-110"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded image overlay */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpandedIndex(null)}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={personaImages[expandedIndex]}
                alt={`User Persona ${expandedIndex + 1}`}
                width={1800}
                height={1200}
                className="w-auto h-auto max-w-full max-h-[90vh] rounded-2xl"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description card */}
      <div className="bg-black mx-12 pb-12">
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Guiding Personas
          </h3>
          <p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            To guide my design decisions, I developed three personas representing different relationship challenges: new couples who struggle to express needs (Elyse), established partners drowning in busy schedules (Matthew), and long-term couples seeking sustainable growth tools (Ericka & Ben). These profiles shaped everything from Vesta&apos;s gentle tone to its calendar integration.
          </p>
        </div>
      </div>

      {/* UserFlow image */}
      <div className="bg-black mx-12 pb-12">
        <Image
          src="/Work/Vesta/Vesta/UserFlow.png"
          alt="Vesta User Flow"
          width={1920}
          height={1080}
          className="w-full h-auto rounded-2xl"
          draggable={false}
        />
      </div>

      {/* Personalized Nudges description card */}
      <div className="bg-black mx-12 pb-12">
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Personalized Nudges
          </h3>
          <p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            I built a system that considers love languages, attachment patterns, mood, partner preferences, and the shifting context of your day. Those signals flow through Claude&apos;s API to create simple, personalized nudges that stay relevant as your relationship evolves.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper that switches between mobile and desktop
function VestaGuidingPersonas() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileVestaGuidingPersonas />;
  }

  return <DesktopVestaGuidingPersonas />;
}

// Vesta Brand System Component with animated annotations
// Brand System symbols data - shared between mobile and desktop
const brandSymbols = [
  {
    name: "Daily Flame",
    description: "Symbol for Vesta, goddess of the hearth, home, and family.",
    subDescription: "Revered for maintaining the sacred and eternal flame that symbolized domestic harmony.",
    icon: "/Work/Vesta/Vesta/VestaIcons_DailyFlame_Icon.svg",
    iconColor: "#fe9f28",
    bgColor: "#ffece1",
    hoverBgColor: "#914b1d",
    horizontalPercent: 15.2,
    verticalPosition: "above" as const,
  },
  {
    name: "Hearth Hub",
    description: "Adaptation of the Herculean knot, associated with marriage, love and protection.",
    subDescription: "The tradition of knot symbols represents love and commitment throughout cultures.",
    icon: "/Work/Vesta/Vesta/VestaIcons_HearthHub_Icon.svg",
    iconColor: "#b52016",
    bgColor: "#d8c5c3",
    hoverBgColor: "#682324",
    horizontalPercent: 40.1,
    verticalPosition: "below" as const,
  },
  {
    name: "Juno",
    description: "Symbol for Juno, goddess of marriage and communication.",
    subDescription: "Juno blessed sacred conversations and mediated understanding between individuals.",
    icon: "/Work/Vesta/Vesta/VestaIcons_Juno_Icon.svg",
    iconColor: "#f8ba67",
    bgColor: "#f2e2d1",
    hoverBgColor: "#896542",
    horizontalPercent: 62.5,
    verticalPosition: "above" as const,
  },
  {
    name: "Oracle's Mirror",
    description: "Symbol for the ancient wisdom from the Oracle of Delphi \"Know Thyself\".",
    subDescription: "The oracle was known for guiding people towards greater self-awareness.",
    icon: "/Work/Vesta/Vesta/VestaIcons_OraclesMirror_Icon.svg",
    iconColor: "#99b0d6",
    bgColor: "#d1dae5",
    hoverBgColor: "#404b60",
    horizontalPercent: 85.0,
    verticalPosition: "below" as const,
  },
];

// Mobile Brand System - carousel with switching icon
function MobileVestaBrandSystem() {
  const { containerRef, x, cardWidth, dragProps } = useDragSnap({
    itemCount: brandSymbols.length,
    cardWidthFraction: 0.8,
  });

  return (
    <div className="relative z-10 bg-black px-4 pt-8 pb-0">
      {/* Header card - styled to match Reflection card */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Brand System
          </h3>
          <p
            className="text-2xl text-white/80 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Vesta draws from Roman mythology to create a cohesive world where tending relationships becomes a sacred ritual. Every element carries symbolic meaning rooted in ancient wisdom.
          </p>
        </div>
      </motion.div>

      {/* Carousel of icon cards - same as desktop BrandIconCard but in hover state by default */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
          style={{ x, touchAction: "pan-y pinch-zoom" }}
          {...dragProps}
        >
          {brandSymbols.map((symbol) => (
            <motion.div
              key={symbol.name}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
            >
              <div
                className="relative overflow-hidden rounded-2xl aspect-square"
                style={{ backgroundColor: symbol.hoverBgColor }}
              >
                {/* Icon container - permanently contracted (hover state) */}
                <div
                  className="absolute flex items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: symbol.bgColor,
                    top: 12,
                    left: 12,
                    right: 12,
                    bottom: 100,
                  }}
                >
                  <div
                    className="w-1/2 h-1/2"
                    style={{
                      backgroundColor: symbol.iconColor,
                      maskImage: `url(${symbol.icon})`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: `url(${symbol.icon})`,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                  />
                </div>
                {/* Content - always visible */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <h3
                    className="text-xs font-bold tracking-wider uppercase mb-2 text-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {symbol.name}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-white/80"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {symbol.name === "Hearth Hub"
                      ? "Adaptation of the Herculean knot, associated with marriage and love."
                      : symbol.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

// Brand Icon Card with hover reveal
function BrandIconCard({ symbol }: { symbol: typeof brandSymbols[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(100);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight + 20;
      setContentHeight(Math.max(height, 100));
    }
  }, [symbol.name, symbol.description]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-square"
      style={{
        backgroundColor: isHovered ? symbol.hoverBgColor : symbol.bgColor,
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Icon container - contracts on hover */}
      <motion.div
        className="absolute flex items-center justify-center overflow-hidden rounded-xl"
        style={{ backgroundColor: symbol.bgColor }}
        animate={{
          top: isHovered ? 12 : 0,
          left: isHovered ? 12 : 0,
          right: isHovered ? 12 : 0,
          bottom: isHovered ? contentHeight : 0,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Icon colored via CSS mask */}
        <div
          className="w-1/2 h-1/2"
          style={{
            backgroundColor: symbol.iconColor,
            maskImage: `url(${symbol.icon})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: `url(${symbol.icon})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
          }}
        />
      </motion.div>

      {/* Content - reveals on hover */}
      <motion.div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 20,
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3
          className="text-xs font-bold tracking-wider uppercase mb-2 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {symbol.name}
        </h3>
        <p
          className="text-sm leading-relaxed text-white/80 max-w-xs"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {symbol.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

// Desktop Brand System - row of 4 icon cards with hover reveal
function DesktopVestaBrandSystem() {
  return (
    <div className="relative z-10 bg-black">
      {/* Icon Grid - row of 4 */}
      <div className="mx-12 py-12">
        <div className="grid grid-cols-4 gap-4">
          {brandSymbols.map((symbol) => (
            <BrandIconCard key={symbol.name} symbol={symbol} />
          ))}
        </div>
      </div>

      {/* Brand System description card - like Juno section */}
      <div className="bg-black mx-12 pb-6">
        <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
          <h3
            className="text-xs font-bold tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
          >
            Brand System
          </h3>
          <p
            className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Vesta draws from Roman mythology to create a cohesive world where tending relationships becomes a sacred ritual. Every element carries symbolic meaning rooted in ancient wisdom.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper that switches between mobile and desktop
function VestaBrandSystem() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show nothing during SSR/hydration to avoid mismatch
  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileVestaBrandSystem />;
  }

  return <DesktopVestaBrandSystem />;
}

export function CaseStudyInfo({ item }: CaseStudyInfoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState(item.sections[0]?.id || "");
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Toggle mute for all videos
  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };


  // React Spring for 3D tilt effect on logos
  const [springProps, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const [rotateX, rotateY] = calcRotation(e.clientX, e.clientY, rect);
    api.start({ rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    api.start({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  // Jiggle animation after logo appears to hint interactivity (Vesta only)
  useEffect(() => {
    if (item.slug === "vesta") {
      // Wait for logo entrance animation (0.6s) + small pause before jiggle
      const timer = setTimeout(() => {
        api.start({
          rotateX: -8,
          rotateY: 12,
          scale: 1.08,
          config: { tension: 300, friction: 10 },
        });
        setTimeout(() => {
          api.start({
            rotateX: 5,
            rotateY: -8,
            scale: 1.04,
            config: { tension: 300, friction: 10 },
          });
          setTimeout(() => {
            api.start({
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              config: { tension: 200, friction: 20 },
            });
          }, 150);
        }, 150);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [item.slug, api]);

  // Helper to render text with *italic* support
  const renderWithItalics = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <section className="relative z-10 bg-black">
      {/* Description Section - Full screen centered */}
      <div className="flex items-center justify-center py-8 md:py-20 md:min-h-screen">
        <div className="flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6 md:mb-12"
          >
            {item.logo ? (
              item.slug === "vesta" ? (
                <motion.div className="perspective-[1000px]">
                  <animated.div
                    ref={logoRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={`${item.logoClassName || "h-8 md:h-12 lg:h-16"} w-auto relative rounded-[22%] overflow-hidden cursor-pointer`}
                    style={{
                      aspectRatio: "1 / 1",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
                      transform: springProps.rotateX.to(
                        (rx) => `perspective(1000px) rotateX(${rx}deg) rotateY(${springProps.rotateY.get()}deg) scale(${springProps.scale.get()})`
                      ),
                    }}
                  >
                    <Image
                      src={item.logo}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </animated.div>
                </motion.div>
              ) : (
                <motion.div className="perspective-[1000px]">
                  <animated.div
                    ref={logoRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={`${item.logoClassName || "h-8 md:h-12 lg:h-16"} w-auto relative cursor-pointer`}
                    style={{
                      aspectRatio: "3 / 1",
                      transform: springProps.rotateX.to(
                        (rx) => `perspective(1000px) rotateX(${rx}deg) rotateY(${springProps.rotateY.get()}deg) scale(${springProps.scale.get()})`
                      ),
                    }}
                  >
                    <Image
                      src={item.logo}
                      alt={item.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </animated.div>
                </motion.div>
              )
            ) : (
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h1>
            )}
          </motion.div>

          {/* Description */}
          <p
            className="text-3xl md:text-4xl lg:text-5xl text-white italic max-w-4xl text-center leading-tight"
            style={{ fontFamily: "'Noe Display', serif" }}
          >
            {item.description}
          </p>

          {/* Category Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="mt-6 md:mt-12 flex flex-wrap gap-2 md:gap-3 justify-center"
          >
            {item.categories.map((category) => (
              <span
                key={category}
                className="inline-block px-3 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full border border-white/20"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {category}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sections - Mobile Carousel */}
      <MobileSectionsCarousel item={item} renderWithItalics={renderWithItalics} />

      {/* Sections - Desktop Side navigation with content */}
      <div className="hidden md:block mx-12 py-16 md:py-24">
        <div className="bg-[#141414] rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16 lg:gap-24">
          {/* Left: Section Navigation */}
          <div className="relative">
            {/* Glowing vertical indicator */}
            <motion.div
              className="absolute left-0 w-0.5 bg-[#85c3ed] rounded-full hidden md:block"
              animate={{
                top: item.sections.findIndex(s => s.id === activeSection) * 56 + 18,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                boxShadow: "0 0 20px 4px rgba(133, 195, 237, 0.5), 0 0 40px 8px rgba(133, 195, 237, 0.3)",
                height: 20,
              }}
            />

            {/* Section Labels */}
            <div className="flex flex-row md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
              {item.sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="relative h-auto md:h-14 px-4 md:px-0 md:pl-6 py-2 md:py-0 flex items-center text-left whitespace-nowrap md:whitespace-normal"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <motion.span
                      className="text-sm font-bold tracking-wider uppercase"
                      animate={{
                        color: isActive ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)",
                        x: isActive ? 4 : 0,
                      }}
                      whileHover={{
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      {section.label}
                    </motion.span>
                    {/* Mobile active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#85c3ed] md:hidden"
                        style={{
                          boxShadow: "0 0 10px 2px rgba(133, 195, 237, 0.5)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Section Content */}
          <div className="relative min-h-[300px] max-w-5xl">
            <AnimatePresence mode="wait">
              {item.sections.map((section) => {
                if (section.id !== activeSection) return null;

                const content = section.content || "";
                const paragraphs = content.split("\n\n");
                const firstParagraph = paragraphs[0];
                const restParagraphs = paragraphs.slice(1).join("\n\n");

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <p
                      className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {renderWithItalics(firstParagraph)}
                    </p>
                    {section.link && (
                      <motion.a
                        href={section.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white/10 hover:bg-[#16588E] rounded-full text-white font-medium transition-colors duration-200"
                        style={{ fontFamily: "var(--font-inter)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        {section.linkLabel || "Learn More"}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </motion.a>
                    )}
                    {restParagraphs && (
                      <motion.p
                        className="mt-8 text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed whitespace-pre-line"
                        style={{ fontFamily: "var(--font-inter)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {renderWithItalics(restParagraphs)}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        </div>
      </div>

      {/* Vesta Onboarding Image with Container Scroll Animation */}
      {item.slug === "vesta" && (
        <>
          {/* Desktop: Onboarding.png */}
          <div className="hidden md:block mx-12">
            <ContainerScroll>
              <Image
                src="/Work/Vesta/Vesta/Onboarding.png"
                alt="Vesta Onboarding Flow"
                width={1920}
                height={1080}
                className="w-full h-auto"
                draggable={false}
              />
            </ContainerScroll>
          </div>
          {/* Mobile: Question2.png with header and intro */}
          <div className="block md:hidden mx-4">
            {/* Ember Analysis card - styled to match Reflection card */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
                <h3
                  className="text-xs font-bold tracking-wider uppercase mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                >
                  Ember Analysis
                </h3>
                <p
                  className="text-2xl text-white/80 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Vesta&apos;s onboarding uses reflective prompts to understand how users love and connect. Relationship duration, location, love language, and attachment style personalize every experience that follows.
                </p>
              </div>
            </motion.div>
            <Image
              src="/Work/Vesta/Mobile/Question2.png"
              alt="Vesta Onboarding Flow"
              width={1080}
              height={1920}
              className="w-full h-auto rounded-2xl"
              draggable={false}
            />
          </div>
        </>
      )}

      {/* Comcast Business Billboard Video with Container Scroll Animation */}
      {item.slug === "comcast-business" && (
        <div className="px-6 md:px-12">
          <ContainerScroll>
            <div className="relative">
              <video
                ref={(el) => { videoRefs.current[1] = el; }}
                src={`${BLOB_BASE}/Work/Comcast%20Business/BrandVideo.mp4`}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-auto rounded-2xl"
              />
              {/* Sound Toggle Button */}
              <motion.button
                onClick={toggleMute}
                className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 transition-colors hover:bg-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                viewport={{ once: true }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </motion.button>
            </div>
          </ContainerScroll>

          {/* Comcast Business Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Comcast%20Business/CB_Poster.png"
                alt="Comcast Business Poster"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Comcast%20Business/PoweringPossibilitiesPoster.png"
                alt="Powering Possibilities Poster"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <video
                src={`${BLOB_BASE}/Work/Comcast%20Business/CBSystemAnimation_Layout.mp4`}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <img
                src="/Work/Comcast%20Business/BusinessCards.png"
                alt="Comcast Business Cards"
                className="w-full h-auto"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <video
                src={`${BLOB_BASE}/Work/Comcast%20Business/Speed_EndCard.mp4`}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              viewport={{ once: true }}
            >
              <video
                src={`${BLOB_BASE}/Work/Comcast%20Business/TaggingSequence.mp4`}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Comcast%20Business/OOH-PGA.png"
                alt="Out of Home PGA"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
              viewport={{ once: true }}
            >
              <video
                ref={(el) => { videoRefs.current[0] = el; }}
                src={`${BLOB_BASE}/Work/Comcast%20Business/MarchPromo.mp4`}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-auto"
              />
              {/* Sound Toggle Button */}
              <motion.button
                onClick={toggleMute}
                className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 transition-colors hover:bg-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                viewport={{ once: true }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </motion.button>
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
              viewport={{ once: true }}
            >
              <video
                src={`${BLOB_BASE}/Work/Comcast%20Business/BillboardMotion.mp4`}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Link Logistics Shipping Container with Container Scroll Animation */}
      {item.slug === "link-logistics" && (
        <div className="px-6 md:mx-12">
          <ContainerScroll>
            <Image
              src="/Work/LinkLogistics/Shipping Container.png"
              alt="Link Logistics Shipping Container"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      )}

      {/* Link Logistics Color Palette Section */}
      {item.slug === "link-logistics" && (
        <LinkLogisticsColorPalette />
      )}

      {/* Link Logistics Space to Grow Video */}
      {item.slug === "link-logistics" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <video
              src={`${BLOB_BASE}/Work/LinkLogistics/SpacetoGrow.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto block"
            />
          </motion.div>
        </div>
      )}

      {/* Link Logistics Warehouse Image */}
      {item.slug === "link-logistics" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <Image
              src="/Work/LinkLogistics/Warehouse.png"
              alt="Link Logistics Warehouse"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </motion.div>
        </div>
      )}

      {/* Link Logistics Leasing Brochure and Website side by side */}
      {item.slug === "link-logistics" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/LinkLogistics/LeasingBrochure.png"
                alt="Link Logistics Leasing Brochure"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <video
                src={`${BLOB_BASE}/Work/LinkLogistics/Icons.mp4`}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Lower Thirds Video */}
          <motion.div
            className="relative overflow-hidden rounded-2xl mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <video
              src={`${BLOB_BASE}/Work/LinkLogistics/LowerThirds.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto block"
            />
          </motion.div>

          {/* Signage and Website side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/LinkLogistics/Signage.png"
                alt="Link Logistics Signage"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <video
                src={`${BLOB_BASE}/Work/LinkLogistics/Website.mp4`}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Link System GIF */}
          <motion.div
            className="relative overflow-hidden rounded-2xl mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <Image
              src="/Work/LinkLogistics/LinkSystem.gif"
              alt="Link Logistics System"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
              unoptimized
            />
          </motion.div>

          {/* Brand Book */}
          <motion.div
            className="relative overflow-hidden rounded-2xl mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <Image
              src="/Work/LinkLogistics/BrandBook.png"
              alt="Link Logistics Brand Book"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </motion.div>
        </div>
      )}

      {/* Vesta Onboarding Content Section */}
      {item.slug === "vesta" && (
        <VestaOnboardingContent />
      )}

      {/* Vesta Features Sticky Scroll Section */}
      {item.slug === "vesta" && (
        <>
          <StickyScroll
            content={[
              {
                title: "Daily Flame + Notifications",
                description: "A simple daily check-in that turns awareness into thoughtful actions with ember alerts tailored to each user's relationship.",
                image: "/Work/Vesta/Vesta/DailyFlame.png",
                hoverBgColor: "#914b1d",
              },
              {
                title: "Connection Compass",
                description: "A guide to how your partner loves, helping you deepen your relationship with intention.",
                image: "/Work/Vesta/Vesta/PartnerLens.png",
                hoverBgColor: "#404b60",
              },
              {
                title: "Spark some Romance",
                description: "Smart suggestions tailored to your time and place, helping shake things up and make time together more memorable.",
                image: "/Work/Vesta/Vesta/LoveArsenal.png",
                hoverBgColor: "#682324",
              },
              {
                title: "Wisdom for Love",
                description: "A companion that listens, remembers, and helps you deepen your connection with care.",
                image: "/Work/Vesta/Vesta/Juno.png",
                hoverBgColor: "#896542",
              },
            ]}
          />
          {/* Juno description card */}
          <div className="hidden md:block bg-black mx-12 pb-6">
            <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                Juno
              </h3>
              <p
                className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Through deliberate prompt engineering, Juno acts as a third presence in the relationship: calm, curious, and attuned. It avoids prescriptions in favor of reflective questions, creating conversations that feel closer to journaling with a trusted confidant than using an app.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Vesta Brand System Section */}
      {item.slug === "vesta" && (
        <VestaBrandSystem />
      )}

      {/* Vesta Guiding Personas Section */}
      {item.slug === "vesta" && (
        <VestaGuidingPersonas />
      )}

      {/* Vesta User Flow Section - Mobile only (desktop is in VestaGuidingPersonas) */}
      {item.slug === "vesta" && (
        <div className="block md:hidden mx-4 mt-8">
          <Image
            src="/Work/Vesta/Vesta/UserFlow.png"
            alt="Vesta User Flow"
            width={1920}
            height={1080}
            className="w-full h-auto rounded-2xl"
            draggable={false}
          />
          {/* Personalized Nudges card - styled to match Reflection card */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                Personalized Nudges
              </h3>
              <p
                className="text-2xl text-white/80 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                I built a system that considers love languages, attachment patterns, mood, partner preferences, and the shifting context of your day. Those signals flow through Claude&apos;s API to create simple, personalized nudges that stay relevant as your relationship evolves.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Vesta Brand Elements Carousel */}
      {item.slug === "vesta" && (
        <VestaBrandElements />
      )}

      {/* Vesta Reflection Section */}
      {item.slug === "vesta" && (
        <VestaReflection />
      )}

      {/* Instacart Billboard Image with Container Scroll Animation */}
      {item.slug === "instacart" && (
        <div className="px-6 md:mx-12">
          <ContainerScroll>
            <Image
              src="/Work/Instacart/SweetPotato_Billboard.png"
              alt="Instacart Sweet Potato Billboard"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      )}

      {/* Instacart Color Palette Section */}
      {item.slug === "instacart" && (
        <InstacartColorPalette />
      )}

      {/* Instacart Tamales OOH Image */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <Image
              src="/Work/Instacart/Tamales_OOH.png"
              alt="Instacart Tamales Out of Home"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </motion.div>
        </div>
      )}

      {/* Instacart Boozy Brunch Video */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <video
              src={`${BLOB_BASE}/Work/Instacart/BoozyBrunch.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      )}

      {/* Instacart Bento Grid */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Instacart/Headline1.png"
                alt="Instacart Headline"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Instacart/ShortRib_Layflat.png"
                alt="Instacart Short Rib Layflat"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Instacart Apple Pie Billboard */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <Image
              src="/Work/Instacart/ApplePie_Billboard.png"
              alt="Instacart Apple Pie Billboard"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </motion.div>
        </div>
      )}

      {/* Instacart Tamales Layflat and Headline2 Side by Side */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Instacart/Tamales_Layflat.png"
                alt="Instacart Tamales Layflat"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Instacart/Headline2.png"
                alt="Instacart Headline 2"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Instacart Phones GIF */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <Image
              src="/Work/Instacart/Phones.gif"
              alt="Instacart Phones"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
              unoptimized
            />
          </motion.div>
        </div>
      )}

      {/* Instacart Image Grid */}
      {item.slug === "instacart" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Instacart/Image1.png"
                alt="Instacart Image 1"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Work/Instacart/Image3.png"
                alt="Instacart Image 3"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* BMW Championship X3 with Container Scroll Animation */}
      {item.slug === "bmw-championship" && (
        <div className="px-6 md:mx-12">
          <ContainerScroll>
            <Image
              src="/work/BMW/BMW Championship/X3.png"
              alt="BMW X3"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      )}

      {/* BMW Championship Image Gallery */}
      {item.slug === "bmw-championship" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          {/* Trophy1 and Course1 side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/Trophy1.png"
                alt="BMW Championship Trophy"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/course1.png"
                alt="Castle Pines Golf Course"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* i4 full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/work/BMW/BMW Championship/i4.png"
              alt="BMW i4"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Keegan and Trophy2 side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/Keegan.png"
                alt="Keegan Bradley"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/Trophy2.png"
                alt="BMW Championship Trophy"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* course2 full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/work/BMW/BMW Championship/UDM.png"
              alt="BMW Championship UDM"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Trophy3 and Backwall side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/Trophy3.png"
                alt="BMW Championship Trophy"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/Backwall.png"
                alt="BMW Championship Backwall"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Rory full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/work/BMW/BMW Championship/Rory.png"
              alt="Rory McIlroy"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Flag and Trophy4 side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/flag.png"
                alt="BMW Championship Flag"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/work/BMW/BMW Championship/Trophy4.png"
                alt="BMW Championship Trophy"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* BMW Indian Wells - HeroVideo with Container Scroll Animation */}
      {item.slug === "bmw-indian-wells" && (
        <div className="px-6 md:mx-12">
          <ContainerScroll>
            <div className="relative">
              <video
                ref={(el) => { videoRefs.current[2] = el; }}
                src={`${BLOB_BASE}/Work/BMW/BMW%20Tennis/HeroVideo.mp4`}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-auto rounded-2xl"
              />
              {/* Sound Toggle Button */}
              <motion.button
                onClick={toggleMute}
                className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 transition-colors hover:bg-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                viewport={{ once: true }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </motion.button>
            </div>
          </ContainerScroll>
        </div>
      )}

      {/* BMW Indian Wells - RacketRoad */}
      {item.slug === "bmw-indian-wells" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/Work/BMW/BMW Tennis/RacketRoad.png"
              alt="BMW Tennis Racket Road"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* BMW Indian Wells Image Gallery */}
      {item.slug === "bmw-indian-wells" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          {/* iX full width */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/Work/BMW/BMW Tennis/iX.png"
              alt="BMW iX"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* RacingCars video full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <video
              src={`${BLOB_BASE}/Work/BMW/BMW%20Tennis/RacingCars.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>

          {/* Court full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/Court.png"
              alt="BMW Tennis Court"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* i4 full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/i4.png"
              alt="BMW i4"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Racket video full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <video
              src={`${BLOB_BASE}/Work/BMW/BMW%20Tennis/Racket.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>

          {/* Rackets full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/Rackets.png"
              alt="BMW Tennis Rackets"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* m5 full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/m5.png"
              alt="BMW M5"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* RacketBall full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/RacketBall.png"
              alt="BMW Tennis Racket Ball"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* DigitalBanners full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/DigitalBanners.png"
              alt="BMW Digital Banners"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Storyboards Card */}
          <motion.div
            className="mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
              <h3
                className="text-xs font-bold tracking-wider uppercase mb-3"
                style={{ fontFamily: "var(--font-inter)", color: "#0ea5e9" }}
              >
                Storyboards
              </h3>
              <p
                className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Worked closely with <a href="https://cekai.jp/" target="_blank" rel="noopener noreferrer" className="text-[#dd0510] underline hover:text-white transition-colors">Cekai Studio</a> to bring the identity to life for the stadium jumbotron and LED boards.
              </p>
            </div>
          </motion.div>

          {/* 4x2 Grid of Storyboards */}
          <div className="mt-4 md:mt-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board1.png"
                    alt="BMW Storyboard 1"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board2.png"
                    alt="BMW Storyboard 2"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board3.png"
                    alt="BMW Storyboard 3"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board4.png"
                    alt="BMW Storyboard 4"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board5.png"
                    alt="BMW Storyboard 5"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board6.png"
                    alt="BMW Storyboard 6"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board7.png"
                    alt="BMW Storyboard 7"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Work/BMW/BMW Tennis/Board8.png"
                    alt="BMW Storyboard 8"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stadium video */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <video
              src={`${BLOB_BASE}/Work/BMW/BMW%20Tennis/Stadium.mov`}
              autoPlay
              muted
              loop
              playsInline
              width={1696}
              height={1264}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

        </div>
      )}

      {/* BMW Indian Wells - BMWBall */}
      {item.slug === "bmw-indian-wells" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/Work/BMW/BMW Tennis/BMWBall.png"
              alt="BMW Tennis Ball"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Merit Systems - 3D Marquee */}
      {item.slug === "merit-systems" && (
        <ThreeDMarquee
          images={[
            "/Work/MeritSystems/BrandBook/MeritBrandBook2.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook4.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook3.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook20.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook8.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook19.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook7.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook5.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook9.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook10.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook11.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook12.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook8.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook14.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook15.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook16.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook17.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook18.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook6.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook13.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook12.jpg",
            "/Work/MeritSystems/BrandBook/MeritBrandBook22.jpg",
          ]}
        />
      )}

      {/* Merit Systems - Conference Stage with Container Scroll Animation */}
      {item.slug === "merit-systems" && (
        <div className="px-6 md:px-12">
          <ContainerScroll>
            <Image
              src="/Work/MeritSystems/Merit.png"
              alt="Merit Systems"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      )}

      {/* Merit Systems Image Gallery */}
      {item.slug === "merit-systems" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          {/* Homepage full width */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/Work/MeritSystems/Homepage.png"
              alt="Merit Systems Homepage"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* ConferenceStage */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/MeritSystems/ConferenceStage.png"
              alt="Merit Systems Conference Stage"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* DeconstructedIcon video */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <video
              src={`${BLOB_BASE}/Work/MeritSystems/DeconstructedIcon.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>

          {/* Hoodie and Moleskin side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/MeritSystems/Hoodie.png"
                alt="Merit Systems Hoodie"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/MeritSystems/Moleskin.png"
                alt="Merit Systems Moleskin"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
          </div>

          {/* Merit-Twitter full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/MeritSystems/Merit-Twitter.png"
              alt="Merit Systems Twitter"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* It All Starts Here - OOH Chatbot with Container Scroll Animation */}
      {item.slug === "it-all-starts-here" && (
        <div className="px-6 md:px-12">
          <ContainerScroll>
            <Image
              src="/Work/ItAllStartsHere/OOH_Chatbot.jpg"
              alt="It All Starts Here - Chatbot OOH"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      )}

      {/* It All Starts Here - Video */}
      {item.slug === "it-all-starts-here" && (
        <ItAllStartsHereVideo />
      )}

      {/* It All Starts Here - Image Gallery */}
      {item.slug === "it-all-starts-here" && (
        <div className="px-6 md:px-12 mt-4 md:mt-6">
          {/* OOH Bus full width */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/Work/ItAllStartsHere/OOH_Bus.jpg"
              alt="It All Starts Here - Bus OOH"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* OOH Garcia full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/ItAllStartsHere/OOH_Garcia.jpg"
              alt="It All Starts Here - Garcia OOH"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Small Business Imagery - 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/ItAllStartsHere/Imagery_SmallBusiness_Bikes.jpg"
                alt="Small Business - Bikes"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/ItAllStartsHere/Imagery_SmallBusiness_Coffee.jpg"
                alt="Small Business - Coffee"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/ItAllStartsHere/Imagery_SmallBusiness_Tatoo.jpg"
                alt="Small Business - Tattoo"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/ItAllStartsHere/Imagery_SmallBusiness_Records.jpg"
                alt="Small Business - Records"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
          </div>

          {/* Magazine full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/ItAllStartsHere/Magazine.png"
              alt="It All Starts Here - Magazine"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Projection Coit Tower full width - GG.png on mobile, Coit Tower on desktop */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/ItAllStartsHere/GG.png"
              alt="It All Starts Here - Golden Gate"
              width={1920}
              height={1080}
              className="w-full h-auto block md:hidden"
              draggable={false}
            />
            <Image
              src="/Work/ItAllStartsHere/Projection_CoitTower.jpg"
              alt="It All Starts Here - Coit Tower Projection"
              width={1920}
              height={1080}
              className="w-full h-auto hidden md:block"
              draggable={false}
            />
          </div>

          {/* Monsters and Oracle side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/ItAllStartsHere/Monsters.png"
                alt="It All Starts Here - Monsters"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/Work/ItAllStartsHere/Oracle.png"
                alt="It All Starts Here - Oracle"
                width={1200}
                height={800}
                className="w-full h-auto"
                draggable={false}
              />
            </div>
          </div>

          {/* OOH Martini Mai Tai full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/ItAllStartsHere/OOH_MartiniMaiTai.jpg"
              alt="It All Starts Here - Martini Mai Tai OOH"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Zaxbys - Coming Soon Card */}
      {item.slug === "zaxbys" && (
        <motion.div
          className="px-6 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="bg-[#141414] rounded-3xl p-10 lg:p-12 border border-white/5">
            <p
              className="text-2xl lg:text-3xl leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "#85c3ed" }}
            >
              Project coming soon
            </p>
          </div>
        </motion.div>
      )}

      {/* Tapered Divider Line */}
      <div
        className="w-full max-w-3xl mx-auto h-px mt-20 md:mt-28"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent)",
        }}
      />

      {/* Explore More Work Section - shown on all case studies */}
      <ExploreMoreWork currentItem={item} />
    </section>
  );
}
