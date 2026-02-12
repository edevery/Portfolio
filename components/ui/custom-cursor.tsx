"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

// Spring configs (stable references outside component)
const MAIN_SPRING = { damping: 22, stiffness: 450, mass: 0.35 };
const CLICK_SPRING = { damping: 18, stiffness: 600, mass: 0.2 };
const ROTATION_SPRING = { damping: 30, stiffness: 200 };

// If cursor jumps more than this many px in one move, teleport instead of spring
const TELEPORT_THRESHOLD = 200;

const NAV_COLOR = "rgba(133, 195, 237, 1)";
const DEFAULT_COLOR = "rgba(255, 255, 255, 0.95)";

function ArrowCursor() {
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
        fill={DEFAULT_COLOR}
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
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs — no re-renders
  const isNavRef = useRef(false);
  const isVisibleRef = useRef(false);
  const hasInitialized = useRef(false);
  const needsTeleport = useRef(false);
  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  // Springs
  const x = useSpring(cursorX, MAIN_SPRING);
  const y = useSpring(cursorY, MAIN_SPRING);
  const scale = useSpring(1, CLICK_SPRING);

  // Subtle rotation based on movement direction (max ±8 degrees)
  const rotation = useTransform(velocityX, [-1500, 0, 1500], [-8, 0, 8]);
  const smoothRotation = useSpring(rotation, ROTATION_SPRING);

  const updateNavStyle = useCallback((isOver: boolean) => {
    const fill = cursorRef.current?.querySelector("path");
    if (fill) fill.setAttribute("fill", isOver ? NAV_COLOR : DEFAULT_COLOR);
    if (innerRef.current) {
      innerRef.current.style.transform = isOver ? "scale(1.1)" : "scale(1)";
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = Date.now();
      const px = e.clientX;
      const py = e.clientY;

      // Detect if we should teleport instead of spring-animate
      const shouldTeleport =
        !hasInitialized.current ||
        needsTeleport.current ||
        (lastPos.current != null &&
          Math.hypot(px - lastPos.current.x, py - lastPos.current.y) >
            TELEPORT_THRESHOLD);

      if (shouldTeleport) {
        // Jump springs directly — no animation
        cursorX.set(px);
        cursorY.set(py);
        x.jump(px);
        y.jump(py);
        velocityX.set(0);
        velocityY.set(0);
        smoothRotation.jump(0);
        lastPos.current = { x: px, y: py, time: now };
        hasInitialized.current = true;
        needsTeleport.current = false;

        // Show cursor (triggers fade-in) now that position is correct
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        return;
      }

      // Normal tracking
      const dt = Math.max(1, now - lastPos.current!.time);
      const vx = Math.max(
        -2000,
        Math.min(2000, ((px - lastPos.current!.x) / dt) * 16)
      );
      const vy = Math.max(
        -2000,
        Math.min(2000, ((py - lastPos.current!.y) / dt) * 16)
      );

      velocityX.set(vx);
      velocityY.set(vy);
      lastPos.current = { x: px, y: py, time: now };

      cursorX.set(px);
      cursorY.set(py);

      // Nav hover detection — ref + DOM, no re-render
      const target = e.target as HTMLElement;
      const isOverNav = !!target.closest("[data-cursor='nav']");
      if (isOverNav !== isNavRef.current) {
        isNavRef.current = isOverNav;
        updateNavStyle(isOverNav);
      }
    },
    [cursorX, cursorY, velocityX, velocityY, x, y, smoothRotation, updateNavStyle]
  );

  const handleMouseDown = useCallback(() => {
    scale.set(0.75);
  }, [scale]);

  const handleMouseUp = useCallback(() => {
    // Overshoot then settle
    scale.set(1.15);
    setTimeout(() => scale.set(1), 80);
  }, [scale]);

  const handleMouseEnter = useCallback(() => {
    // Don't show yet — let first mousemove teleport to correct position first
    needsTeleport.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isVisibleRef.current = false;
    setIsVisible(false);
    velocityX.set(0);
    velocityY.set(0);
    needsTeleport.current = true;
    lastPos.current = null;
  }, [velocityX, velocityY]);

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
  }, [
    isMobile,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
  ]);

  if (isMobile) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x,
        y,
        scale,
        rotate: smoothRotation,
      }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.15 } }}
    >
      <div
        ref={innerRef}
        style={{
          transition:
            "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <ArrowCursor />
      </div>
    </motion.div>
  );
}
