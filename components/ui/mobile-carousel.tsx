"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/case-study/transition-link";

const CAROUSEL_CONFIG = {
  stiffness: 550,
  damping: 42,
  dragElastic: 0.04,
  velocityThreshold: 250,
  sidePadding: 32,
  gap: 16,
} as const;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);
  const [activeIndex, setActiveIndex] = useState(0);

  const x = useMotionValue(0);
  const springX = useSpring(x, {
    damping: CAROUSEL_CONFIG.damping,
    stiffness: CAROUSEL_CONFIG.stiffness,
  });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      setCardWidth(width - CAROUSEL_CONFIG.sidePadding * 2);
    }
  }, []);

  useEffect(() => {
    updateDimensions();

    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [updateDimensions]);

  const totalWidth = cards.length * (cardWidth + CAROUSEL_CONFIG.gap) - CAROUSEL_CONFIG.gap;
  const maxDrag = Math.max(0, totalWidth - containerWidth + CAROUSEL_CONFIG.sidePadding * 2);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;
    const cardWithGap = cardWidth + CAROUSEL_CONFIG.gap;

    let targetIndex = Math.round(-currentX / cardWithGap);

    if (Math.abs(velocity) > CAROUSEL_CONFIG.velocityThreshold) {
      targetIndex += velocity > 0 ? -1 : 1;
    }

    targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));

    const targetX = -targetIndex * cardWithGap;
    x.set(Math.max(-maxDrag, Math.min(0, targetX)));
    setActiveIndex(targetIndex);
  };

  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div ref={containerRef} className="overflow-hidden flex-1 flex items-center">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{
            x: springX,
            gap: CAROUSEL_CONFIG.gap,
            paddingLeft: CAROUSEL_CONFIG.sidePadding,
            paddingRight: CAROUSEL_CONFIG.sidePadding,
            touchAction: "pan-y pinch-zoom",
          }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          onDragEnd={handleDragEnd}
          dragElastic={CAROUSEL_CONFIG.dragElastic}
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
              "w-1.5 h-1.5 rounded-full transition-colors duration-200",
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
