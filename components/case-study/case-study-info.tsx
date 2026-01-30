"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { WorkItem } from "@/lib/work-data";

interface CaseStudyInfoProps {
  item: WorkItem;
}

export function CaseStudyInfo({ item }: CaseStudyInfoProps) {
  const [activeSection, setActiveSection] = useState(item.sections[0]?.id || "role");

  const activeContent = item.sections.find((s) => s.id === activeSection);
  const activeIndex = item.sections.findIndex((s) => s.id === activeSection);

  return (
    <section className="relative z-10 bg-black px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 flex justify-center"
        >
          {item.logo ? (
            <motion.div
              className={`${item.logoClassName || "h-8 md:h-12 lg:h-16"} w-auto relative`}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2,
              }}
              whileHover={{
                scale: 1.02,
                filter: `drop-shadow(0 0 20px ${item.accentColor}66)`,
                transition: { duration: 0.3 },
              }}
              style={{ aspectRatio: "3 / 1" }}
            >
              <Image
                src={item.logo}
                alt={item.title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          ) : (
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {item.title}
            </h1>
          )}
        </motion.div>

        {/* Category Tags - above description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex gap-3"
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

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl text-white/60 mb-8 italic max-w-3xl"
          style={{ fontFamily: "'Noe Display', serif" }}
        >
          {item.description}
        </motion.p>

        {/* Row 2 & 3: Section Navigation + Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16 pt-8 border-t border-white/10"
        >
          {/* Left: Section Buttons with Glowing Indicator */}
          <div className="relative">
            {/* Glowing vertical bar indicator */}
            <motion.div
              className="absolute left-0 w-0.5 bg-[#85c3ed] rounded-full"
              style={{
                boxShadow: "0 0 20px 4px rgba(133, 195, 237, 0.5), 0 0 40px 8px rgba(133, 195, 237, 0.3)",
              }}
              initial={false}
              animate={{
                top: activeIndex * 56 + 18,
                height: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />

            {/* Section Buttons */}
            <div className="flex flex-col">
              {item.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="relative h-14 pl-6 text-left transition-colors duration-200"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span
                    className={`text-sm font-bold tracking-wider uppercase transition-colors duration-200 ${
                      activeSection === section.id
                        ? "text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    {section.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content Area */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <p
                  className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl whitespace-pre-line"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {activeContent?.content}
                </p>
                {activeContent?.link && (
                  <a
                    href={activeContent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white/10 hover:bg-[#ff9e29] rounded-full text-white font-medium transition-colors duration-200"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Try Vesta
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
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
