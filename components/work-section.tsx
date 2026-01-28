"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ui/project-card";

type Category =
  | "all"
  | "product"
  | "identity"
  | "graphic"
  | "illustration"
  | "experiential"
  | "art direction"
  | "generative";

interface WorkItem {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  image: string;
  accentColor: string;
  // Grid span: wide (2 cols) or standard (1 col)
  className?: string;
}

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "identity", label: "Identity" },
  { id: "product", label: "Product" },
  { id: "experiential", label: "Experiential" },
  { id: "art direction", label: "Art Direction" },
  { id: "generative", label: "Generative" },
  { id: "illustration", label: "Illustration" },
  { id: "graphic", label: "Graphic" },
];

const workItems: WorkItem[] = [
  {
    id: "1",
    title: "Vesta",
    description: "AI-Powered Relationship Companion designed to keep the flame alive.",
    categories: ["product", "identity", "generative"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    accentColor: "#e11d48",
    className: "md:col-span-2",
  },
  {
    id: "2",
    title: "Instacart",
    description: "Debut brand campaign revealing the secret ingredient behind home-cooked meals.",
    categories: ["identity", "art direction"],
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
    accentColor: "#16a34a",
    className: "md:col-span-1",
  },
  {
    id: "3",
    title: "Comcast Business",
    description: "A flexible brand system designed to evolve with business.",
    categories: ["identity", "art direction", "graphic"],
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
    accentColor: "#2563eb",
    className: "md:col-span-1",
  },
  {
    id: "4",
    title: "BMW",
    description: "Tennis-meets-motorsport identity designed for Indian Wells.",
    categories: ["illustration", "identity", "art direction", "experiential"],
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
    accentColor: "#0ea5e9",
    className: "md:col-span-2",
  },
  {
    id: "5",
    title: "Link Logistics",
    description: "A modular brand system designed to scale with America's largest logistics real estate company.",
    categories: ["identity", "art direction", "graphic"],
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
    accentColor: "#f97316",
    className: "md:col-span-1",
  },
  {
    id: "6",
    title: "BMW Championship",
    description: "Experiential design built around ultimate performance.",
    categories: ["art direction", "experiential", "identity"],
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80",
    accentColor: "#1d4ed8",
    className: "md:col-span-1",
  },
  {
    id: "7",
    title: "Merit Systems",
    description: "Foundational brand identity for an open-source economics platform.",
    categories: ["identity", "product"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    accentColor: "#7c3aed",
    className: "md:col-span-1",
  },
  {
    id: "8",
    title: "It All Starts Here",
    description: "A citywide campaign celebrating San Francisco's enduring influence on innovation.",
    categories: ["art direction", "experiential", "generative"],
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    accentColor: "#dc2626",
    className: "md:col-span-2",
  },
  {
    id: "9",
    title: "Zaxbys",
    description: "QSR system bringing cohesion to constant change.",
    categories: ["art direction"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    accentColor: "#ea580c",
    className: "md:col-span-1",
  },
  {
    id: "10",
    title: "Hoka",
    description: "Joyful brand system built around the euphoria of movement.",
    categories: ["graphic"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    accentColor: "#0891b2",
    className: "md:col-span-1",
  },
  {
    id: "11",
    title: "Spanx",
    description: "White pants, designed for real life.",
    categories: ["art direction"],
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
    accentColor: "#be185d",
    className: "md:col-span-1",
  },
  {
    id: "12",
    title: "Adidas",
    description: "Packaging and posters built from elements of the sneaker itself.",
    categories: ["graphic", "art direction"],
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
    accentColor: "#171717",
    className: "md:col-span-2",
  },
];

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
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[28rem]"
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
                className="w-full h-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
