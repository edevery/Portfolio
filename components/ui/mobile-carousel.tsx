"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDragSnap } from "@/lib/use-drag-snap";
import { TransitionLink } from "@/components/case-study/transition-link";

interface CarouselCard {
  title: string;
  description: string;
  image: string;
  accentColor: string;
  slug: string;
  logo?: string;
}

interface MobileCarouselProps {
  cards: CarouselCard[];
  className?: string;
}

export function MobileCarousel({ cards, className }: MobileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { containerRef, x, cardWidth, dragProps } = useDragSnap({
    itemCount: cards.length,
    gap: 16,
    padding: 32,
    velocityThreshold: 250,
    onIndexChange: setActiveIndex,
  });

  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div ref={containerRef} className="overflow-hidden flex-1 flex items-center">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{
            x,
            gap: 16,
            paddingLeft: 32,
            paddingRight: 32,
            touchAction: "pan-y pinch-zoom",
          }}
          {...dragProps}
        >
          {cards.map((card) => (
            <MobileCarouselCard
              key={card.slug}
              card={card}
              width={cardWidth}
            />
          ))}
        </motion.div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 py-4">
        {cards.map((card, i) => (
          <span
            key={card.slug}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              i === activeIndex ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface MobileCarouselCardProps {
  card: CarouselCard;
  width: number;
}

function MobileCarouselCard({ card, width }: MobileCarouselCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragStartX.current) > 5) {
      setIsDragging(true);
    }
  };

  const handlePointerUp = () => {
    // Reset dragging state after a short delay to allow click to fire
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      className="flex-shrink-0"
      style={{ width }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <TransitionLink
        href={`/work/${card.slug}`}
        className="block"
        onClick={handleClick}
      >
        <div className="rounded-2xl overflow-hidden aspect-[3/4]">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </TransitionLink>
    </motion.div>
  );
}
