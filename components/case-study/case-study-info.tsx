"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useMotionTemplate, useMotionValue, PanInfo } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import { workItems, type WorkItem } from "@/lib/work-data";
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

// Vesta Onboarding Content Component with staggered entrance animations
function VestaOnboardingContent() {
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardWidth = containerWidth * 0.8; // 80% width to show glimpse of next card
  const gap = 12;
  const totalWidth = columns.length * (cardWidth + gap) - gap;
  const maxDrag = Math.max(0, totalWidth - containerWidth + 32);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;

    const cardWithGap = cardWidth + gap;
    let targetIndex = Math.round(-currentX / cardWithGap);

    if (Math.abs(velocity) > 500) {
      targetIndex += velocity > 0 ? -1 : 1;
    }

    targetIndex = Math.max(0, Math.min(columns.length - 1, targetIndex));
    const targetX = -targetIndex * cardWithGap;
    x.set(Math.max(-maxDrag, Math.min(0, targetX)));
  };

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
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -maxDrag, right: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.1}
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
    <div className="relative z-20 bg-black px-6 md:px-12 lg:px-24 py-32 md:py-48">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 italic"
            style={{ fontFamily: "'Noe Display', serif", color: "white" }}
          >
            Color Palette
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Reminiscent of a home-cooked meal
          </p>
        </motion.div>

        {/* Color Grid */}
        <motion.div
          className="overflow-visible rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Two rows with gap */}
          <div className="grid grid-rows-2 gap-2">
            {/* Top row */}
            <div className="grid grid-cols-8 gap-2">
              {colors.slice(0, 8).map((color, index) => (
                <motion.div
                  key={color.name}
                  className="relative aspect-[1/1.2] cursor-pointer rounded-lg overflow-hidden"
                  style={{ backgroundColor: color.hex, willChange: "transform" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: hoveredIndex === index ? 1.15 : 1,
                    zIndex: hoveredIndex === index ? 10 : 1,
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Hover overlay with name and hex */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="text-[10px] md:text-xs font-medium tracking-wider uppercase text-center leading-tight mb-1"
                      style={{
                        fontFamily: "var(--font-inter)",
                        color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                      }}
                    >
                      {color.name.split(" ").slice(0, 1).join(" ")}<br />
                      {color.name.split(" ").slice(1).join(" ")}
                    </span>
                    <span
                      className="text-[10px] md:text-xs font-mono"
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
                  onMouseEnter={() => setHoveredIndex(index + 8)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: hoveredIndex === index + 8 ? 1.15 : 1,
                    zIndex: hoveredIndex === index + 8 ? 10 : 1,
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Hover overlay with name and hex */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index + 8 ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="text-[10px] md:text-xs font-medium tracking-wider uppercase text-center leading-tight mb-1"
                      style={{
                        fontFamily: "var(--font-inter)",
                        color: isLightColor(color.hex) ? "#1a1a1a" : "#ffffff",
                      }}
                    >
                      {color.name.split(" ").slice(0, 1).join(" ")}<br />
                      {color.name.split(" ").slice(1).join(" ")}
                    </span>
                    <span
                      className="text-[10px] md:text-xs font-mono"
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
        </motion.div>
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
    <div className="relative z-20 bg-black px-6 md:px-12 lg:px-24 py-32 md:py-48">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 italic"
            style={{ fontFamily: "'Noe Display', serif", color: "white" }}
          >
            Color Palette
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Muted palette inspired by industrial photography
          </p>
        </motion.div>

        {/* Color Grid - Custom L-shaped layout */}
        <motion.div
          className="overflow-visible"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          viewport={{ once: true }}
        >
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
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: hoveredIndex === index ? 1.18 : 1,
                  zIndex: hoveredIndex === index ? 10 : 1,
                }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Hover overlay with name and hex */}
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center p-2"
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
        </motion.div>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardWidth = containerWidth * 0.85;
  const gap = 12;
  const totalWidth = personaImages.length * (cardWidth + gap) - gap;
  const maxDrag = Math.max(0, totalWidth - containerWidth + 32);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;

    const cardWithGap = cardWidth + gap;
    let targetIndex = Math.round(-currentX / cardWithGap);

    if (Math.abs(velocity) > 500) {
      targetIndex += velocity > 0 ? -1 : 1;
    }

    targetIndex = Math.max(0, Math.min(personaImages.length - 1, targetIndex));
    const targetX = -targetIndex * cardWithGap;
    x.set(Math.max(-maxDrag, Math.min(0, targetX)));
  };

  return (
    <div className="relative z-20 bg-black px-4 pt-8 pb-8">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2
          className="text-2xl tracking-tight mb-4"
          style={{ fontFamily: "'Noe Display', serif", color: "white" }}
        >
          Guiding Personas
        </h2>
        <p
          className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Three personas representing different relationship challenges shaped Vesta&apos;s gentle tone and calendar integration.
        </p>
      </motion.div>

      {/* Simple Carousel */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
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

// Desktop Guiding Personas - scroll-based animation
function DesktopVestaGuidingPersonas() {
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

  // Progress indicator opacities
  const dot1Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.58, 0.64], [0.3, 1, 1, 0.3]);
  const dot2Opacity = useTransform(scrollYProgress, [0.58, 0.65, 0.72, 0.78], [0.3, 1, 1, 0.3]);
  const dot3Opacity = useTransform(scrollYProgress, [0.72, 0.80, 0.88, 0.95], [0.3, 1, 1, 1]);
  const dotOpacities = [dot1Opacity, dot2Opacity, dot3Opacity];

  const personas = [
    { image: personaImages[0], opacity: persona1Opacity },
    { image: personaImages[1], opacity: persona2Opacity },
    { image: personaImages[2], opacity: persona3Opacity },
  ];

  return (
    <div ref={scrollContainerRef} className="relative z-20 bg-black" style={{ height: "500vh" }}>
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

        {/* Progress Indicators */}
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

        {/* Carousel Container */}
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
    horizontalPercent: 15.2,
    verticalPosition: "above" as const,
  },
  {
    name: "Hearth Hub",
    description: "Adaptation of the Herculean knot, associated with marriage, love and protection.",
    subDescription: "The tradition of knot symbols represents love and commitment throughout cultures.",
    icon: "/Work/Vesta/Vesta/VestaIcons_HearthHub_Icon.svg",
    horizontalPercent: 40.1,
    verticalPosition: "below" as const,
  },
  {
    name: "Juno",
    description: "Symbol for Juno, goddess of marriage and communication.",
    subDescription: "Juno blessed sacred conversations and mediated understanding between individuals.",
    icon: "/Work/Vesta/Vesta/VestaIcons_Juno_Icon.svg",
    horizontalPercent: 62.5,
    verticalPosition: "above" as const,
  },
  {
    name: "Oracle's Mirror",
    description: "Symbol for the ancient wisdom from the Oracle of Delphi \"Know Thyself\".",
    subDescription: "The oracle was known for guiding people towards greater self-awareness.",
    icon: "/Work/Vesta/Vesta/VestaIcons_OraclesMirror_Icon.svg",
    horizontalPercent: 85.0,
    verticalPosition: "below" as const,
  },
];

// Mobile Brand System - carousel with switching icon
function MobileVestaBrandSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardWidth = containerWidth * 0.8;
  const gap = 12;
  const totalWidth = brandSymbols.length * (cardWidth + gap) - gap;
  const maxDrag = Math.max(0, totalWidth - containerWidth + 32);

  // Update active index during drag
  const updateActiveIndex = (currentX: number) => {
    const cardWithGap = cardWidth + gap;
    if (cardWithGap > 0) {
      const newIndex = Math.round(-currentX / cardWithGap);
      const clampedIndex = Math.max(0, Math.min(brandSymbols.length - 1, newIndex));
      setActiveIndex(clampedIndex);
    }
  };

  const handleDrag = () => {
    updateActiveIndex(x.get());
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;

    const cardWithGap = cardWidth + gap;
    let targetIndex = Math.round(-currentX / cardWithGap);

    if (Math.abs(velocity) > 500) {
      targetIndex += velocity > 0 ? -1 : 1;
    }

    targetIndex = Math.max(0, Math.min(brandSymbols.length - 1, targetIndex));
    const targetX = -targetIndex * cardWithGap;
    x.set(Math.max(-maxDrag, Math.min(0, targetX)));
    setActiveIndex(targetIndex);
  };

  return (
    <div className="relative z-10 bg-black px-4 pt-8 pb-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2
          className="text-2xl tracking-tight mb-4"
          style={{ fontFamily: "'Noe Display', serif", color: "white" }}
        >
          Brand System
        </h2>
        <p
          className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Vesta draws from Roman mythology to create a cohesive world where tending relationships becomes a sacred ritual. Every element carries symbolic meaning rooted in ancient wisdom.
        </p>
      </motion.div>

      {/* Switching Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          {brandSymbols.map((symbol, index) => (
            <motion.img
              key={symbol.name}
              src={symbol.icon}
              alt={symbol.name}
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                scale: activeIndex === index ? 1 : 0.8,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
        >
          {brandSymbols.map((symbol) => (
            <motion.div
              key={symbol.name}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
            >
              <div className="bg-transparent border border-white/30 rounded-2xl p-5 h-full">
                <h3
                  className="text-xs font-bold tracking-wider uppercase mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#85c3ed" }}
                >
                  {symbol.name}
                </h3>
                <p
                  className="text-sm text-white/60 leading-relaxed mb-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {symbol.description}
                </p>
                <p
                  className="text-xs text-white/40 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {symbol.subDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

// Desktop Brand System - scroll-based animation
function DesktopVestaBrandSystem() {
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

  return (
    <div ref={scrollContainerRef} className="relative z-10 bg-black" style={{ height: "350vh" }}>
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
              Vesta draws from Roman mythology to create a cohesive world where tending relationships becomes a sacred ritual. Every element carries symbolic meaning rooted in ancient wisdom.
            </p>
          </motion.div>

          {/* Central Image with Annotations */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Annotations Above */}
            <div className="relative h-32 mb-8">
              {brandSymbols
                .filter((s) => s.verticalPosition === "above")
                .map((symbol) => {
                  const index = brandSymbols.indexOf(symbol);
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
              {brandSymbols.map((symbol, index) => (
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
              {brandSymbols
                .filter((s) => s.verticalPosition === "below")
                .map((symbol) => {
                  const index = brandSymbols.indexOf(symbol);
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
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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

          {/* Description */}
          <p
            className="text-3xl md:text-4xl lg:text-5xl text-white/60 italic max-w-4xl text-center leading-tight"
            style={{ fontFamily: "'Noe Display', serif" }}
          >
            {item.description}
          </p>

          {/* Category Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
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
        </div>
      </div>

      {/* Sections - Side navigation with content */}
      <div className="px-4 md:mx-12 py-16 md:py-24">
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
            {/* Ember Analysis header and intro text */}
            <h2
              className="text-2xl text-white text-center mb-4"
              style={{ fontFamily: "'Noe Display', serif", fontStyle: "italic" }}
            >
              Ember Analysis
            </h2>
            <p
              className="text-base text-white/70 text-center leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Vesta&apos;s onboarding uses reflective prompts to understand how users love and connect. Relationship duration, location, love language, and attachment style personalize every experience that follows.
            </p>
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
            <video
              src="/Work/Comcast%20Business/BillboardMotion.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto rounded-2xl"
            />
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
                src="/Work/Comcast%20Business/CBSystemAnimation_Layout.mp4"
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
                src="/Work/Comcast%20Business/Speed_EndCard.mp4"
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
                src="/Work/Comcast%20Business/TaggingSequence.mp4"
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
                src="/Work/Comcast%20Business/MarchPromo.mp4"
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
                src="/Work/Comcast%20Business/DigitalBoard.mp4"
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
        <div className="mx-12">
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

      {/* Link Logistics Warehouse Image with Scroll Animation */}
      {item.slug === "link-logistics" && (
        <div className="mx-12 pt-16 md:pt-24">
          <ContainerScroll>
            <Image
              src="/Work/LinkLogistics/Warehouse.png"
              alt="Link Logistics Warehouse"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
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
                src="/Work/LinkLogistics/Icons.mp4"
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
              src="/Work/LinkLogistics/LowerThirds.mov"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </motion.div>

          {/* Logo Animation Video */}
          <motion.div
            className="relative overflow-hidden rounded-2xl mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
          >
            <video
              src="/Work/LinkLogistics/LogoAnimation.mov"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
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
                src="/Work/LinkLogistics/Website.mp4"
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

      {/* Instacart Billboard Image with Container Scroll Animation */}
      {item.slug === "instacart" && (
        <div className="mx-12">
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

      {/* Instacart Tamales OOH Image with Container Scroll Animation */}
      {item.slug === "instacart" && (
        <div className="mx-12">
          <ContainerScroll>
            <Image
              src="/Work/Instacart/Tamales_OOH.png"
              alt="Instacart Tamales Out of Home"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
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
            <motion.div
              className="relative overflow-hidden rounded-2xl md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              viewport={{ once: true }}
            >
              <video
                src="/Work/Instacart/BoozyBrunch.mov"
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
        <div className="mx-12">
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
              src="/work/BMW/BMW Championship/course2.png"
              alt="Castle Pines Golf Course"
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

      {/* BMW Indian Wells - RacketRoad with Container Scroll Animation */}
      {item.slug === "bmw-indian-wells" && (
        <div className="mx-12">
          <ContainerScroll>
            <Image
              src="/Work/BMW/BMW Tennis/RacketRoad.png"
              alt="BMW Tennis Racket Road"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
            />
          </ContainerScroll>
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
              src="/Work/BMW/BMW Tennis/RacingCars.mp4"
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
              src="/Work/BMW/BMW Tennis/Racket.mp4"
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

          {/* CarFlip gif full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/BMW/BMW Tennis/CarFlip.gif"
              alt="BMW Car Flip Animation"
              width={1920}
              height={1080}
              className="w-full h-auto"
              draggable={false}
              unoptimized
            />
          </div>

          {/* Storyboards Section */}
          <div className="py-32 md:py-56">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 italic"
                style={{ fontFamily: "'Noe Display', serif", color: "white" }}
              >
                Storyboards
              </h2>
              <p
                className="text-base md:text-lg lg:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Worked closely with Cekai Studio to bring the identity to life for the stadium jumbotron and LED boards.
              </p>
            </div>

            {/* 4x2 Grid of Storyboards */}
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

        </div>
      )}

      {/* BMW Indian Wells - Stadium with Container Scroll Animation */}
      {item.slug === "bmw-indian-wells" && (
        <div className="mx-12">
          <ContainerScroll>
            <video
              src="/Work/BMW/BMW Tennis/Stadium.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </ContainerScroll>
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
        <div className="mx-12">
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
              src="/Work/MeritSystems/DeconstructedIcon.mp4"
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
        <div className="mx-12">
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

          {/* Projection Coit Tower full width */}
          <div className="relative overflow-hidden rounded-2xl mt-4 md:mt-6">
            <Image
              src="/Work/ItAllStartsHere/Projection_CoitTower.jpg"
              alt="It All Starts Here - Coit Tower Projection"
              width={1920}
              height={1080}
              className="w-full h-auto"
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
