"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import type { WorkItem } from "@/lib/work-data";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

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

export function CaseStudyInfo({ item }: CaseStudyInfoProps) {
  // "description" for the intro, or a section id for the nav sections
  const [activeContent, setActiveContent] = useState<"description" | string>("description");
  const [hasRevealed, setHasRevealed] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isDescription = activeContent === "description";
  const activeSection = isDescription ? null : item.sections.find((s) => s.id === activeContent);
  const activeIndex = isDescription ? -1 : item.sections.findIndex((s) => s.id === activeContent);

  // Total scroll segments: 3 for description (longer scroll) + number of sections
  const descriptionWeight = 3;
  const totalSegments = descriptionWeight + item.sections.length;

  // Track scroll progress through the container
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start center", "end center"],
  });

  // Update active content based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Trigger reveal animation when scrolling starts
    if (progress > 0.02 && !hasRevealed) {
      setHasRevealed(true);
    }

    const segmentIndex = Math.min(
      Math.floor(progress * totalSegments),
      totalSegments - 1
    );

    // Calculate reveal progress within description phase (0 to 1)
    const descriptionEndProgress = descriptionWeight / totalSegments;
    if (progress < descriptionEndProgress) {
      const normalizedProgress = progress / descriptionEndProgress;
      setRevealProgress(normalizedProgress);
    } else {
      setRevealProgress(1);
    }

    if (segmentIndex < descriptionWeight) {
      // First segments are for description (takes 2 scrolls worth)
      if (activeContent !== "description") {
        setActiveContent("description");
      }
    } else {
      // Remaining segments are the sections
      const sectionIndex = segmentIndex - descriptionWeight;
      const section = item.sections[sectionIndex];
      if (section && activeContent !== section.id) {
        setActiveContent(section.id);
      }
    }
  });

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

  // Jiggle animation after logo appears to hint interactivity
  const hasJiggledRef = useRef(false);
  useEffect(() => {
    if (item.slug === "vesta" && revealProgress > 0.65 && !hasJiggledRef.current) {
      hasJiggledRef.current = true;
      // Wait for logo entrance animation (0.6s) + small pause before jiggle
      setTimeout(() => {
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
      }, 800);
    }
  }, [item.slug, api, revealProgress]);

  return (
    <section className="relative z-10 bg-black">
      {/* Scroll-driven Content Container */}
      <div
        ref={scrollContainerRef}
        style={{ height: `${totalSegments * 60}vh` }}
        className="relative"
      >
        {/* Sticky content area - full viewport height for centering, pb for optical center */}
        <div className="sticky top-0 min-h-screen flex items-center justify-center pb-20">
          <AnimatePresence mode="wait">
            {isDescription ? (
              /* Description View - Full screen centered */
              <motion.div
                key="description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto"
              >
                {/* Logo - appears after description is revealed */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: revealProgress > 0.65 ? 1 : 0,
                    scale: revealProgress > 0.65 ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="mb-12"
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

                {/* Description - cascading word reveal with blur-to-sharp */}
                <p
                  className="text-3xl md:text-4xl lg:text-5xl text-white/60 italic max-w-4xl text-center leading-tight"
                  style={{ fontFamily: "'Noe Display', serif" }}
                >
                  {item.description.split(" ").map((word, index, arr) => {
                    // Stagger with significant overlap - words cascade smoothly
                    const staggerStart = (index / arr.length) * 0.4;
                    const staggerEnd = staggerStart + 0.25;

                    // Calculate interpolated progress for smooth transition
                    const wordRevealProgress = hasRevealed
                      ? Math.max(0, Math.min(1, (revealProgress - staggerStart) / (staggerEnd - staggerStart)))
                      : 0;

                    return (
                      <span
                        key={index}
                        className="inline"
                        style={{
                          opacity: wordRevealProgress,
                          filter: `blur(${(1 - wordRevealProgress) * 4}px)`,
                          transition: "opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), filter 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        {word}
                        {index < arr.length - 1 && " "}
                      </span>
                    );
                  })}
                </p>

                {/* Category Tags - appear in parallel with logo after description is revealed */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: revealProgress > 0.65 ? 1 : 0,
                    y: revealProgress > 0.65 ? 0 : 10
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="mt-12 flex gap-3 justify-center"
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
              </motion.div>
            ) : (
              /* Sections View with Nav - shifted up for visual center */
              <motion.div
                key="sections"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-24 md:pb-32 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-24 lg:gap-32">
                  {/* Left: Section Navigation with Glowing Indicator */}
                  <div className="relative">
                    {/* Glowing vertical bar indicator */}
                    <motion.div
                      className="absolute left-0 w-0.5 bg-[#85c3ed] rounded-full"
                      style={{
                        boxShadow: "0 0 20px 4px rgba(133, 195, 237, 0.5), 0 0 40px 8px rgba(133, 195, 237, 0.3)",
                      }}
                      initial={false}
                      animate={{
                        top: Math.max(0, activeIndex) * 56 + 18,
                        height: 20,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />

                    {/* Section Labels */}
                    <div className="flex flex-col">
                      {item.sections.map((section) => (
                        <div
                          key={section.id}
                          className="relative h-14 pl-6 flex items-center"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          <span
                            className={`text-sm font-bold tracking-wider uppercase transition-colors duration-200 ${
                              activeContent === section.id
                                ? "text-white"
                                : "text-white/40"
                            }`}
                          >
                            {section.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Section Content */}
                  <div className="relative min-h-[200px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeContent}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {(() => {
                          const content = activeSection?.content || "";
                          const paragraphs = content.split("\n\n");
                          const firstParagraph = paragraphs[0];
                          const restParagraphs = paragraphs.slice(1).join("\n\n");

                          return (
                            <>
                              <p
                                className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl whitespace-pre-line"
                                style={{ fontFamily: "var(--font-inter)" }}
                              >
                                {firstParagraph}
                              </p>
                              {activeSection?.link && (
                                <a
                                  href={activeSection.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 mt-6 mb-6 px-6 py-3 bg-white/10 hover:bg-[#16588E] rounded-full text-white font-medium transition-colors duration-200"
                                  style={{ fontFamily: "var(--font-inter)" }}
                                >
                                  {activeSection.linkLabel || "Learn More"}
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
                              {restParagraphs && (
                                <p
                                  className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl whitespace-pre-line"
                                  style={{ fontFamily: "var(--font-inter)" }}
                                >
                                  {restParagraphs}
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Vesta Onboarding Image with Container Scroll Animation */}
      {item.slug === "vesta" && (
        <div className="mx-12">
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
      )}
    </section>
  );
}
