"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);
  const gap = 16;

  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        // Card width is container width minus padding (32px each side)
        setCardWidth(width - 64);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const totalWidth = cards.length * (cardWidth + gap) - gap;
  const maxDrag = Math.max(0, totalWidth - containerWidth + 64);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;

    // Calculate which card we should snap to
    const cardWithGap = cardWidth + gap;
    let targetIndex = Math.round(-currentX / cardWithGap);

    // Add velocity-based adjustment
    if (Math.abs(velocity) > 500) {
      targetIndex += velocity > 0 ? -1 : 1;
    }

    // Clamp to valid range
    targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));

    // Snap to card
    const targetX = -targetIndex * cardWithGap;
    x.set(Math.max(-maxDrag, Math.min(0, targetX)));
  };

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex gap-4 px-8 cursor-grab active:cursor-grabbing"
        style={{ x: springX }}
        drag="x"
        dragConstraints={{ left: -maxDrag, right: 0 }}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
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
