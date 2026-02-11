"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Geometry ────────────────────────────────────────────────────────
const R = 120; // circle radius
const VB_W = 1000;
const VB_Y = 80;
const VB_H = 400;

// Initial positions: spread apart in a horizontal row
const INITIAL = [
  { cx: 140, cy: 300 }, // Brand
  { cx: 500, cy: 300 }, // Product
  { cx: 860, cy: 300 }, // Tech
];

// Final positions: equilateral-triangle Venn arrangement
const FINAL = [
  { cx: 435, cy: 338 }, // Brand  (bottom-left)
  { cx: 500, cy: 225 }, // Product (top-center)
  { cx: 565, cy: 338 }, // Tech   (bottom-right)
];

const LABELS = ["Brand", "Product", "Tech"];

// Centroid of the final triangle (radial-grow origin)
const CENTER_X = (FINAL[0].cx + FINAL[1].cx + FINAL[2].cx) / 3;
const CENTER_Y = (FINAL[0].cy + FINAL[1].cy + FINAL[2].cy) / 3;

const ACCENT = "#85c3ed";

// ─── Scroll mapping ranges (within 0-1 scrollYProgress) ─────────────
const CONVERGE_START = 0.15;
const CONVERGE_END = 0.5;
const FILL_START = 0.52;
const FILL_END = 0.62;

// ─── Mobile timing (ms) ─────────────────────────────────────────────
const MOBILE_CONVERGE_MS = 1200;
const MOBILE_FILL_MS = 800;

// ─── Helpers ─────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ─── Mobile timed animation hook ────────────────────────────────────
function useMobileAnimation(visible: boolean, isMobile: boolean) {
  const [converge, setConverge] = useState(0);
  const [fill, setFill] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;

    // Phase 1: converge
    const rawConverge = clamp(elapsed / MOBILE_CONVERGE_MS, 0, 1);
    setConverge(easeInOutCubic(rawConverge));

    // Phase 2: fill (starts after converge finishes)
    const fillElapsed = elapsed - MOBILE_CONVERGE_MS;
    if (fillElapsed > 0) {
      const rawFill = clamp(fillElapsed / MOBILE_FILL_MS, 0, 1);
      setFill(easeOutCubic(rawFill));
    }

    if (elapsed < MOBILE_CONVERGE_MS + MOBILE_FILL_MS) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (!isMobile || !visible) return;
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile, visible, animate]);

  return { converge, fill };
}

// ─── Component ───────────────────────────────────────────────────────
interface VennDiagramProps {
  progress: number;
  visible?: boolean;
  isMobile?: boolean;
}

export function VennDiagram({
  progress,
  visible = false,
  isMobile = false,
}: VennDiagramProps) {
  const convergeT = easeInOutCubic(
    clamp((progress - CONVERGE_START) / (CONVERGE_END - CONVERGE_START), 0, 1),
  );
  const fillT = easeOutCubic(
    clamp((progress - FILL_START) / (FILL_END - FILL_START), 0, 1),
  );

  const mobile = useMobileAnimation(visible, isMobile);

  const t = isMobile ? mobile.converge : convergeT;
  const f = isMobile ? mobile.fill : fillT;

  const circles = INITIAL.map((init, i) => ({
    cx: lerp(init.cx, FINAL[i].cx, t),
    cy: lerp(init.cy, FINAL[i].cy, t),
  }));

  return (
    <svg
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(8px)",
        transition: "opacity 1.2s ease, filter 1.2s ease",
      }}
      viewBox={`0 ${VB_Y} ${VB_W} ${VB_H}`}
      className="w-full max-w-2xl mx-auto"
      aria-label="Venn diagram of Brand, Product, and Tech"
    >
      <defs>
        <clipPath id="venn-clip-a">
          <circle cx={circles[0].cx} cy={circles[0].cy} r={R} />
        </clipPath>
        <clipPath id="venn-clip-b">
          <circle cx={circles[1].cx} cy={circles[1].cy} r={R} />
        </clipPath>
        <filter id="circle-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Three-circle intersection fill (blue) */}
      <g clipPath="url(#venn-clip-a)">
        <g clipPath="url(#venn-clip-b)">
          <circle
            cx={circles[2].cx}
            cy={circles[2].cy}
            r={R}
            fill={ACCENT}
            opacity={f}
            style={{
              transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
              transform: `scale(${f})`,
            }}
          />
        </g>
      </g>

      {/* Circle outlines with subtle glow */}
      {circles.map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          filter="url(#circle-glow)"
        />
      ))}

      {/* Labels — fade out as circles converge */}
      {circles.map((c, i) => (
        <text
          key={i}
          x={c.cx}
          y={c.cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={ACCENT}
          fontSize="16"
          fontWeight="700"
          letterSpacing="0.08em"
          opacity={1 - t}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {LABELS[i].toUpperCase()}
        </text>
      ))}

    </svg>
  );
}
