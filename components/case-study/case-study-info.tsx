"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useMotionTemplate } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import { workItems, type WorkItem } from "@/lib/work-data";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Link from "next/link";
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

// Vesta Onboarding Content Component with scroll-linked column animations
function VestaOnboardingContent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start center", "end center"],
  });

  // Each column animates in sequence as user scrolls through the tall container
  // Column 1: appears first (15-40%)
  // Column 2: appears second (35-60%)
  // Column 3: appears third (55-80%)
  const column1Opacity = useTransform(scrollYProgress, [0.15, 0.28, 0.4], [0, 0.5, 1]);
  const column1Y = useTransform(scrollYProgress, [0.15, 0.4], [60, 0]);

  const column2Opacity = useTransform(scrollYProgress, [0.35, 0.48, 0.6], [0, 0.5, 1]);
  const column2Y = useTransform(scrollYProgress, [0.35, 0.6], [60, 0]);

  const column3Opacity = useTransform(scrollYProgress, [0.55, 0.68, 0.8], [0, 0.5, 1]);
  const column3Y = useTransform(scrollYProgress, [0.55, 0.8], [60, 0]);

  const columns = [
    {
      title: "Relationship Context",
      content: "Vesta adjusts its tone and content based on the couple's relationship duration and living dynamic, recognizing that a 6-month relationship and a 6-year one require different forms of support.",
      opacity: column1Opacity,
      y: column1Y,
    },
    {
      title: "Location",
      content: "Location awareness enables Vesta to suggest contextually relevant date ideas, from nearby restaurants to weekend getaways. The app adapts to users' surroundings while respecting privacy preferences.",
      opacity: column2Opacity,
      y: column2Y,
    },
    {
      title: "Emotional Frameworks",
      content: "Vesta recognizes that partners express love differently: through quality time, words of affirmation, acts of service, physical touch, or gifts. This understanding allows tailored suggestions for each unique relationship dynamic.",
      opacity: column3Opacity,
      y: column3Y,
    },
  ];

  return (
    <div ref={scrollContainerRef} className="relative z-10 bg-black" style={{ height: "200vh" }}>
      {/* Sticky content that stays centered while scrolling */}
      <div className="sticky top-0 min-h-screen flex items-center">
        <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Intro text */}
            <p
              className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl mb-16"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Vesta&apos;s onboarding guides users through a series of reflective prompts to uncover how they love and connect. Users share key details such as relationship duration, location, love language, and attachment style. These inputs shape every experience that follows.
            </p>

            {/* Three column grid with scroll-linked animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {columns.map((column, index) => (
                <motion.div
                  key={column.title}
                  className={`${index > 0 ? "border-l border-[#85c3ed]/30 pl-8" : ""}`}
                  style={{
                    opacity: column.opacity,
                    y: column.y,
                  }}
                >
                  <h3
                    className="text-xs font-bold tracking-wider uppercase mb-4"
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Vesta Brand Elements Carousel Component
function VestaBrandElements() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start end", "end end"],
  });

  // Transform scroll progress to horizontal translation
  // 5 slides means we need to move -400% total (each slide is 100%)
  // Delayed start at 0.22 gives pause for first slide to settle
  const carouselX = useTransform(scrollYProgress, [0.22, 0.92], ["0%", "-400%"]);

  // Individual slide opacities - first slide gets extra hold time
  // Slide 1: visible immediately, holds until 0.28, then fades
  const slide1Opacity = useTransform(scrollYProgress, [0.08, 0.12, 0.28, 0.35], [0.4, 1, 1, 0.4]);
  const slide2Opacity = useTransform(scrollYProgress, [0.28, 0.35, 0.45, 0.52], [0.4, 1, 1, 0.4]);
  const slide3Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.62, 0.69], [0.4, 1, 1, 0.4]);
  const slide4Opacity = useTransform(scrollYProgress, [0.62, 0.69, 0.79, 0.86], [0.4, 1, 1, 0.4]);
  const slide5Opacity = useTransform(scrollYProgress, [0.79, 0.86, 0.92, 0.98], [0.4, 1, 1, 1]);

  // Text animations - appears when slide is at full opacity, fades before next slide
  // Text 1: appears after image settles, holds, then fades before transition
  const text1Opacity = useTransform(scrollYProgress, [0.10, 0.14, 0.24, 0.28], [0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.33, 0.37, 0.43, 0.47], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.50, 0.54, 0.60, 0.64], [0, 1, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.67, 0.71, 0.77, 0.81], [0, 1, 1, 0]);
  const text5Opacity = useTransform(scrollYProgress, [0.84, 0.88, 0.94, 0.98], [0, 1, 1, 1]);

  // Progress indicator opacities
  const dot1Opacity = useTransform(scrollYProgress, [0.08, 0.12, 0.28, 0.35], [0.3, 1, 1, 0.3]);
  const dot2Opacity = useTransform(scrollYProgress, [0.28, 0.35, 0.45, 0.52], [0.3, 1, 1, 0.3]);
  const dot3Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.62, 0.69], [0.3, 1, 1, 0.3]);
  const dot4Opacity = useTransform(scrollYProgress, [0.62, 0.69, 0.79, 0.86], [0.3, 1, 1, 0.3]);
  const dot5Opacity = useTransform(scrollYProgress, [0.79, 0.86, 0.92, 0.98], [0.3, 1, 1, 1]);
  const dotOpacities = [dot1Opacity, dot2Opacity, dot3Opacity, dot4Opacity, dot5Opacity];

  const slides = [
    {
      image: "/Work/Vesta/Vesta/BrandSystem4.png",
      title: "Mood Board",
      description: "I was inspired by classical murals in the Louvre and Roman sculptures of gods and goddesses, delicate serif typography, and fire-like gradients to express love as both timeless and luminous.",
      opacity: slide1Opacity,
      textOpacity: text1Opacity,
    },
    {
      image: "/Work/Vesta/Vesta/BrandSystem1.png",
      title: "Color Palette",
      description: "The warm reds and golds balance the cool blues to convey both passion and ease.",
      opacity: slide2Opacity,
      textOpacity: text2Opacity,
    },
    {
      image: "/Work/Vesta/Vesta/BrandSystem2.png",
      title: "Gradients",
      description: "I created custom CSS mesh gradients for a modern sense of light and warmth. Inspired by flames, designed to feel calm, fluid, and alive within the app experience.",
      opacity: slide3Opacity,
      textOpacity: text3Opacity,
    },
    {
      image: "/Work/Vesta/Vesta/BrandSystem3.png",
      title: "Typography",
      description: "I paired Bugari, inspired by Roman engravings to bring a sense of timeless reverence, with Inter for its modern clarity.",
      opacity: slide4Opacity,
      textOpacity: text4Opacity,
    },
    {
      image: "/Work/Vesta/Vesta/BrandSystem5.png",
      title: "Logo",
      description: "I customized the logotype to overlap the e-s and t-a. A subtle adjustment to make the letters feel close and connected.",
      opacity: slide5Opacity,
      textOpacity: text5Opacity,
    },
  ];

  return (
    <div ref={scrollContainerRef} className="relative z-20 bg-black mt-32 md:mt-48" style={{ height: "600vh" }}>
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-20 pb-40">
        {/* Text Container - above carousel */}
        <div className="relative h-36 mb-10 w-full max-w-3xl mx-auto px-6">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex flex-col items-center justify-end text-center px-6"
              style={{ opacity: slide.textOpacity }}
            >
              <h3
                className="text-sm md:text-base font-bold tracking-wider uppercase mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
              >
                {slide.title}
              </h3>
              <p
                className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {slide.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Carousel Container - mask only affects overflow edges, not the centered image */}
        <div
          className="w-full max-w-6xl mx-auto overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
          }}
        >
          <motion.div
            className="flex"
            style={{ x: carouselX }}
          >
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-full px-8 md:px-16"
                style={{ opacity: slide.opacity }}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={1920}
                  height={1080}
                  className="w-full h-auto rounded-2xl"
                  draggable={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress Indicators - below carousel */}
        <div className="flex gap-3 mt-8">
          {dotOpacities.map((dotOpacity, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-white"
              style={{ opacity: dotOpacity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Vesta Reflection Component - final section with video
function VestaReflection() {
  const videoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });

  // Video starts full screen, waits until centered, then settles in with margins and rounded corners
  // 0.3 = video is centered on screen, 0.5 = settled
  const videoMargin = useTransform(scrollYProgress, [0.3, 0.5], [0, 48]);
  const videoBorderRadius = useTransform(scrollYProgress, [0.3, 0.5], [0, 24]);

  return (
    <div className="relative z-20 bg-black mt-32 md:mt-48 pb-32 md:pb-48">
      {/* Video - starts full screen, settles in with rounded corners */}
      <div ref={videoRef} className="relative mb-32 md:mb-40">
        <motion.div
          className="relative overflow-hidden"
          style={{
            marginLeft: videoMargin,
            marginRight: videoMargin,
            borderRadius: videoBorderRadius,
          }}
        >
          <video
            src="/Work/Vesta/Vesta/Reflection.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
          />
        </motion.div>
      </div>

      {/* Text Container - animates in after video */}
      <motion.div
        className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 text-center"
        initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6"
          style={{ fontFamily: "'Noe Display', serif", color: "white" }}
        >
          Reflection
        </h2>
        <p
          className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed mb-6"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Vesta is the culmination of years spent designing systems that bridge logic and emotion. At agencies, I&apos;ve helped brands craft stories that connect people to ideas. With Vesta, I wanted to design something that connects people.
        </p>
        <p
          className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Building it solo, with AI as my collaborator, pushed me to think not just as a designer, but as a systems thinker, strategist, and developer. It reminded me why I design: to make empathy scalable, to turn intention into action, and to build tools that help love last.
        </p>
      </motion.div>
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
                className="relative overflow-hidden rounded-xl cursor-pointer aspect-square"
                style={{ backgroundColor: project.accentColor }}
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
                        className="px-2 py-1 text-xs rounded-full bg-white/20 text-white/90"
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

// Vesta Guiding Personas Component with scroll-driven carousel
function VestaGuidingPersonas() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start end", "end end"],
  });

  // Card slides up from below viewport
  const cardY = useTransform(scrollYProgress, [0, 0.08], ["60vh", "0vh"]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  // Transform scroll progress to horizontal translation (after intro settles)
  const carouselX = useTransform(scrollYProgress, [0.45, 0.92], ["0%", "-200%"]);

  // Intro text animations - elegant entrance with longer visibility
  // Fades in 5-15%, stays visible 15-35%, fades out 35-45%
  const introOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.45], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.45], [60, 0, 0, -40]);
  const introBlur = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.45], [12, 0, 0, 6]);
  const introFilter = useMotionTemplate`blur(${introBlur}px)`;
  const introScale = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.45], [0.92, 1, 1, 0.96]);

  // Carousel fades in smoothly with slight scale as intro exits
  const carouselOpacity = useTransform(scrollYProgress, [0.40, 0.50], [0, 1]);
  const carouselScale = useTransform(scrollYProgress, [0.40, 0.50], [0.94, 1]);

  // Individual persona opacities for highlighting active one
  const persona1Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.58, 0.64], [0.4, 1, 1, 0.4]);
  const persona2Opacity = useTransform(scrollYProgress, [0.58, 0.65, 0.72, 0.78], [0.4, 1, 1, 0.4]);
  const persona3Opacity = useTransform(scrollYProgress, [0.72, 0.80, 0.88, 0.95], [0.4, 1, 1, 1]);

  // Progress indicator opacities (defined at top level to follow rules of hooks)
  const dot1Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.58, 0.64], [0.3, 1, 1, 0.3]);
  const dot2Opacity = useTransform(scrollYProgress, [0.58, 0.65, 0.72, 0.78], [0.3, 1, 1, 0.3]);
  const dot3Opacity = useTransform(scrollYProgress, [0.72, 0.80, 0.88, 0.95], [0.3, 1, 1, 1]);
  const dotOpacities = [dot1Opacity, dot2Opacity, dot3Opacity];

  const personas = [
    {
      image: "/Work/Vesta/Vesta/UserPersona-1.png",
      opacity: persona1Opacity,
    },
    {
      image: "/Work/Vesta/Vesta/UserPersona-2.png",
      opacity: persona2Opacity,
    },
    {
      image: "/Work/Vesta/Vesta/UserPersona-3.png",
      opacity: persona3Opacity,
    },
  ];

  return (
    <div ref={scrollContainerRef} className="relative z-20 bg-black" style={{ height: "500vh" }}>
      {/* Card that slides up */}
      <motion.div
        className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-20 pb-32"
        style={{ y: cardY, opacity: cardOpacity }}
      >
        {/* Intro Text */}
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pointer-events-none z-10"
          style={{
            opacity: introOpacity,
            y: introY,
            scale: introScale,
            filter: introFilter,
          }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6"
            style={{ fontFamily: "'Noe Display', serif", color: "white" }}
          >
            Guiding Personas
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            To guide my design decisions, I developed three personas representing different relationship challenges: new couples who struggle to express needs (Elyse), established partners drowning in busy schedules (Matthew), and long-term couples seeking sustainable growth tools (Ericka & Ben). These profiles shaped everything from Vesta&apos;s gentle tone to its calendar integration.
          </p>
        </motion.div>

        {/* Progress Indicators - above carousel */}
        <motion.div
          className="flex gap-3 mb-8"
          style={{ opacity: carouselOpacity }}
        >
          {dotOpacities.map((dotOpacity, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-white"
              style={{ opacity: dotOpacity }}
            />
          ))}
        </motion.div>

        {/* Carousel Container - mask only affects overflow edges, not the centered image */}
        <motion.div
          className="w-full max-w-6xl mx-auto overflow-hidden"
          style={{
            opacity: carouselOpacity,
            scale: carouselScale,
            maskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
          }}
        >
          <motion.div
            className="flex"
            style={{ x: carouselX }}
          >
            {personas.map((persona, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-full px-8 md:px-16"
                style={{ opacity: persona.opacity }}
              >
                <Image
                  src={persona.image}
                  alt={`User Persona ${index + 1}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-2xl"
                  draggable={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Vesta Brand System Component with animated annotations
function VestaBrandSystem() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = intro, 0-3 = symbols

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // First 20% is intro, then 4 equal sections for each symbol
    if (progress < 0.2) {
      setActiveIndex(-1);
    } else {
      const symbolProgress = (progress - 0.2) / 0.8;
      const index = Math.min(Math.floor(symbolProgress * 4), 3);
      setActiveIndex(index);
    }
  });

  // Each symbol has explicit positioning calculated from SVG coordinates
  // Pill spans x=258.93 to x=2171.27 (width=1912.34)
  // Symbol centers derived from path coordinates
  const symbols = [
    {
      name: "Daily Flame",
      description: "Symbol for Vesta, goddess of the hearth, home, and family.",
      subDescription: "Revered for maintaining the sacred and eternal flame that symbolized domestic harmony.",
      horizontalPercent: 15.2, // Center ~550px → (550-258.93)/1912.34
      verticalPosition: "above" as const,
    },
    {
      name: "Hearth Hub",
      description: "Adaptation of the Herculean knot, associated with marriage, love and protection.",
      subDescription: "The tradition of knot symbols represents love and commitment throughout cultures.",
      horizontalPercent: 40.1, // Center ~1025px → (1025-258.93)/1912.34
      verticalPosition: "below" as const,
    },
    {
      name: "Juno",
      description: "Symbol for Juno, goddess of marriage and communication.",
      subDescription: "Juno blessed sacred conversations and mediated understanding between individuals.",
      horizontalPercent: 62.5, // Adjusted for visual alignment
      verticalPosition: "above" as const,
    },
    {
      name: "Oracle's Mirror",
      description: "Symbol for the ancient wisdom from the Oracle of Delphi \"Know Thyself\".",
      subDescription: "The oracle was known for guiding people towards greater self-awareness.",
      horizontalPercent: 85.0, // Center ~1885px → (1885-258.93)/1912.34
      verticalPosition: "below" as const,
    },
  ];

  return (
    <div ref={scrollContainerRef} className="relative z-10 bg-black mt-32 md:mt-48" style={{ height: "350vh" }}>
      <div className="sticky top-0 min-h-screen flex items-center justify-center pb-32 md:pb-48">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Intro - visible when activeIndex is -1 */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeIndex === -1 ? 1 : 0,
              y: activeIndex === -1 ? 0 : -20,
            }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6"
              style={{ fontFamily: "'Noe Display', serif", color: "white" }}
            >
              Brand System
            </h2>
            <p
              className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Vesta draws from Roman mythology to create a cohesive world where tending relationships becomes a sacred ritual. Every element, from app name to navigation, carries symbolic meaning rooted in ancient wisdom.
            </p>
          </motion.div>

          {/* Central Image with Annotations */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Annotations Above */}
            <div className="relative h-32 mb-8">
              {symbols
                .filter((s) => s.verticalPosition === "above")
                .map((symbol) => {
                  const index = symbols.indexOf(symbol);
                  const isActive = activeIndex === index;

                  return (
                    <motion.div
                      key={symbol.name}
                      className="absolute text-left"
                      style={{
                        left: `${symbol.horizontalPercent}%`,
                        bottom: 0,
                        width: "200px",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 10,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <h4
                        className="text-sm md:text-base font-bold tracking-wider uppercase mb-2"
                        style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                      >
                        {symbol.name}
                      </h4>
                      <p
                        className="text-sm text-white/80 leading-relaxed mb-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {symbol.description}
                      </p>
                      <p
                        className="text-xs text-white/50 leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {symbol.subDescription}
                      </p>
                      {/* Connecting Line */}
                      <motion.div
                        className="absolute w-px h-8 bg-white/30"
                        style={{ left: 0, top: "calc(100% + 12px)" }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </motion.div>
                  );
                })}
            </div>

            {/* Navigation Dock Image */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: activeIndex >= 0 ? 1 : 0.3,
                scale: activeIndex >= 0 ? 1 : 0.95,
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Work/Vesta/Vesta/BrandNavigationDock.svg"
                alt="Vesta Brand Navigation Dock"
                className="w-full h-auto"
                draggable={false}
              />
              {/* Icon glow overlays - highlight active icon */}
              {symbols.map((symbol, index) => (
                <motion.div
                  key={`glow-${symbol.name}`}
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${symbol.horizontalPercent}%`,
                    width: "60px",
                    height: "60px",
                    marginLeft: "-30px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(133, 195, 237, 0.4) 0%, rgba(133, 195, 237, 0) 70%)",
                    filter: "blur(8px)",
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1.2 : 0.5,
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
              ))}
            </motion.div>

            {/* Annotations Below */}
            <div className="relative h-32 mt-8">
              {symbols
                .filter((s) => s.verticalPosition === "below")
                .map((symbol) => {
                  const index = symbols.indexOf(symbol);
                  const isActive = activeIndex === index;

                  return (
                    <motion.div
                      key={symbol.name}
                      className="absolute text-left"
                      style={{
                        left: `${symbol.horizontalPercent}%`,
                        top: 0,
                        width: "200px",
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : -10,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Connecting Line */}
                      <motion.div
                        className="absolute w-px h-8 bg-white/30"
                        style={{ left: 0, bottom: "calc(100% + 12px)" }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      />
                      <h4
                        className="text-sm md:text-base font-bold tracking-wider uppercase mb-2 mt-4"
                        style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                      >
                        {symbol.name}
                      </h4>
                      <p
                        className="text-sm text-white/80 leading-relaxed mb-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {symbol.description}
                      </p>
                      <p
                        className="text-xs text-white/50 leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {symbol.subDescription}
                      </p>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

      {/* Vesta Onboarding Content Section */}
      {item.slug === "vesta" && (
        <VestaOnboardingContent />
      )}

      {/* Vesta Features Sticky Scroll Section */}
      {item.slug === "vesta" && (
        <StickyScroll
          content={[
            {
              title: "Daily Flame + Notifications",
              description: "A simple daily check-in that turns awareness into thoughtful actions with ember alerts tailored to each user's relationship.",
              image: "/Work/Vesta/Vesta/DailyFlame.png",
            },
            {
              title: "Connection Compass",
              description: "A guide to how your partner loves, helping you deepen your relationship with intention.",
              image: "/Work/Vesta/Vesta/PartnerLens.png",
            },
            {
              title: "Spark some Romance",
              description: "Smart suggestions tailored to your time and place, helping shake things up and make time together more memorable.",
              image: "/Work/Vesta/Vesta/LoveArsenal.png",
            },
            {
              title: "Wisdom for Love",
              description: "A companion that listens, remembers, and helps you deepen your connection with care.",
              subDescription: "Juno speaks as a third presence in the relationship: calm, curious, and attuned. Through deliberate prompt engineering, it uses fire as its central metaphor to reinforce the brand verbally. Rather than prescriptive solutions, Juno asks reflective questions and speaks poetically yet accessibly in lowercase text, creating conversations that feel less like app advice and more like journaling with a trusted confidant.",
              image: "/Work/Vesta/Vesta/Juno.png",
            },
          ]}
        />
      )}

      {/* Vesta Brand System Section */}
      {item.slug === "vesta" && (
        <VestaBrandSystem />
      )}

      {/* Vesta Guiding Personas Section */}
      {item.slug === "vesta" && (
        <VestaGuidingPersonas />
      )}

      {/* Vesta User Flow Section */}
      {item.slug === "vesta" && (
        <div className="mx-12 mt-32 md:mt-48">
          <ContainerScroll>
            <Image
              src="/Work/Vesta/Vesta/UserFlow.png"
              alt="Vesta User Flow"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
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

      {/* Explore More Work Section - shown on all case studies */}
      <ExploreMoreWork currentItem={item} />
    </section>
  );
}
