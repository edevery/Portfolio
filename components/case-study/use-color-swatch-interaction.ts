"use client";

import { useRef, useState } from "react";

/**
 * Press-and-hold on touch, hover on desktop.
 *
 * Shared by the case-study color palettes and the Incase iconography grid so
 * reveal-on-hover blocks behave identically across the site. The touch
 * timestamp guards against the synthetic mouseenter iOS fires after a tap.
 */
export function useColorSwatchInteraction() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const lastTouchTimeRef = useRef(0);

  const getSwatchProps = (index: number) => ({
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      setActiveIndex(index);
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!touchStartPos.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        setActiveIndex(null);
        touchStartPos.current = null;
      }
    },
    onTouchEnd: () => {
      setActiveIndex(null);
      touchStartPos.current = null;
      lastTouchTimeRef.current = Date.now();
    },
    onTouchCancel: () => {
      setActiveIndex(null);
      touchStartPos.current = null;
      lastTouchTimeRef.current = Date.now();
    },
    onMouseEnter: () => {
      if (Date.now() - lastTouchTimeRef.current > 500) setActiveIndex(index);
    },
    onMouseLeave: () => {
      if (Date.now() - lastTouchTimeRef.current > 500) setActiveIndex(null);
    },
  });

  return { activeIndex, getSwatchProps };
}
