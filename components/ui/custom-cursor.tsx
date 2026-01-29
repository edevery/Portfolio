"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

function ArrowCursor({ color }: { color: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: -2, marginTop: -2 }}
    >
      <path
        d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
        fill={color}
      />
      <path
        d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.75"
      />
    </svg>
  );
}

export function CustomCursor() {
  const [isNav, setIsNav] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null);

  // Premium spring configs
  // Main cursor - responsive but with subtle weight
  const mainSpring = { damping: 22, stiffness: 450, mass: 0.35 };
  // Click feedback - punchy
  const clickSpring = { damping: 18, stiffness: 600, mass: 0.2 };

  const x = useSpring(cursorX, mainSpring);
  const y = useSpring(cursorY, mainSpring);
  const scale = useSpring(1, clickSpring);

  // Subtle rotation based on movement direction (max ±8 degrees)
  const rotation = useTransform(velocityX, [-1500, 0, 1500], [-8, 0, 8]);
  const smoothRotation = useSpring(rotation, { damping: 30, stiffness: 200 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = Date.now();

      // Initialize lastPos on first move
      if (!lastPos.current) {
        lastPos.current = { x: e.clientX, y: e.clientY, time: now };
      }

      const dt = Math.max(1, now - lastPos.current.time);

      // Calculate velocity for rotation effect
      const vx = (e.clientX - lastPos.current.x) / dt * 16;
      const vy = (e.clientY - lastPos.current.y) / dt * 16;

      velocityX.set(vx);
      velocityY.set(vy);

      lastPos.current = { x: e.clientX, y: e.clientY, time: now };

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isOverNav = !!target.closest("[data-cursor='nav']");
      if (isOverNav !== isNav) {
        setIsNav(isOverNav);
      }
    },
    [cursorX, cursorY, velocityX, velocityY, isNav]
  );

  const handleMouseDown = useCallback(() => {
    scale.set(0.75);
  }, [scale]);

  const handleMouseUp = useCallback(() => {
    // Overshoot then settle - feels satisfying
    scale.set(1.15);
    setTimeout(() => scale.set(1), 80);
  }, [scale]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    velocityX.set(0);
  }, [velocityX]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!isMobile) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseenter", handleMouseEnter);
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave]);

  if (isMobile) return null;

  const color = isNav ? "rgba(133, 195, 237, 1)" : "rgba(255, 255, 255, 0.95)";

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x,
        y,
        scale,
        rotate: smoothRotation,
      }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.12 } }}
    >
      <motion.div
        animate={{ scale: isNav ? 1.1 : 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 400,
        }}
      >
        <ArrowCursor color={color} />
      </motion.div>
    </motion.div>
  );
}
