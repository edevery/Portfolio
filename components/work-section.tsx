"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ui/project-card";
import { workItems, categories, type Category } from "@/lib/work-data";

export function WorkSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredItems =
    activeCategory === "all"
      ? workItems
      : workItems.filter((item) => item.categories.includes(activeCategory));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Category Filter Tags */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            data-cursor="nav"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border border-white/20 hover:border-white/40",
              activeCategory === category.id
                ? "bg-white text-black"
                : "bg-transparent text-white hover:bg-white/10"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Bento Box Grid - fixed row heights for perfect alignment */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[28rem] grid-flow-row-dense"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                opacity: { duration: 0.2 },
                layout: { type: "spring", stiffness: 350, damping: 30 },
              }}
              className={item.className}
            >
              <ProjectCard
                title={item.title}
                description={item.description}
                categories={item.categories}
                image={item.image}
                accentColor={item.accentColor}
                slug={item.slug}
                className="w-full h-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
