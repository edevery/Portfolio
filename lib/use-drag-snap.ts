"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMotionValue, animate, type MotionValue, type PanInfo } from "framer-motion";

interface DragSnapConfig {
  /** Number of items in the carousel */
  itemCount: number;
  /** Gap between cards in px (default 12) */
  gap?: number;
  /** Edge padding in px (default 16) */
  padding?: number;
  /** Card width as fraction of container (e.g. 0.85). If omitted, uses containerWidth - padding*2 */
  cardWidthFraction?: number;
  /** Velocity threshold for flick detection (default 500) */
  velocityThreshold?: number;
  /** Spring stiffness (default 550) */
  stiffness?: number;
  /** Spring damping (default 42) */
  damping?: number;
  /** Drag elasticity (default 0.1) */
  dragElastic?: number;
  /** Called when active index changes */
  onIndexChange?: (index: number) => void;
}

interface DragSnapReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  cardWidth: number;
  dragProps: {
    drag: "x";
    dragConstraints: { left: number; right: number };
    dragElastic: number;
    onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  };
}

export function useDragSnap({
  itemCount,
  gap = 12,
  padding = 16,
  cardWidthFraction,
  velocityThreshold = 500,
  stiffness = 550,
  damping = 42,
  dragElastic = 0.1,
  onIndexChange,
}: DragSnapConfig): DragSnapReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardWidth = cardWidthFraction
    ? containerWidth * cardWidthFraction
    : containerWidth - padding * 2;

  const totalWidth = itemCount * (cardWidth + gap) - gap;
  const maxDrag = Math.max(0, totalWidth - containerWidth + padding * 2);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentX = x.get();
      const velocity = info.velocity.x;
      const cardWithGap = cardWidth + gap;

      let targetIndex = Math.round(-currentX / cardWithGap);
      if (Math.abs(velocity) > velocityThreshold) {
        targetIndex += velocity > 0 ? -1 : 1;
      }
      targetIndex = Math.max(0, Math.min(itemCount - 1, targetIndex));

      const targetX = Math.max(-maxDrag, Math.min(0, -targetIndex * cardWithGap));
      animate(x, targetX, { type: "spring", stiffness, damping });
      onIndexChange?.(targetIndex);
    },
    [x, cardWidth, gap, velocityThreshold, itemCount, maxDrag, stiffness, damping, onIndexChange],
  );

  return {
    containerRef,
    x,
    cardWidth,
    dragProps: {
      drag: "x",
      dragConstraints: { left: -maxDrag, right: 0 },
      dragElastic,
      onDragEnd: handleDragEnd,
    },
  };
}
