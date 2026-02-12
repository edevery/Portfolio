"use client";

import { useEffect, useRef, useMemo } from "react";

// ─── Geometry ────────────────────────────────────────────────────────
const R = 120;     // desktop circle radius
const M_R = 80;    // mobile circle radius

// ─── Desktop layout (horizontal row → equilateral triangle) ─────────
const VB_W = 1000;
const VB_Y = 80;
const VB_H = 400;

const INITIAL = [
  { cx: 140, cy: 300 }, // Brand
  { cx: 500, cy: 300 }, // Product
  { cx: 860, cy: 300 }, // Tech
];

const FINAL = [
  { cx: 435, cy: 338 }, // Brand  (bottom-left)
  { cx: 500, cy: 225 }, // Product (top-center)
  { cx: 565, cy: 338 }, // Tech   (bottom-right)
];

const CENTER_X = (FINAL[0].cx + FINAL[1].cx + FINAL[2].cx) / 3;
const CENTER_Y = (FINAL[0].cy + FINAL[1].cy + FINAL[2].cy) / 3;

// ─── Mobile layout (vertical stack → equilateral triangle) ──────────
const M_VB_W = 500;
const M_VB_Y = 0;
const M_VB_H = 800;

const M_INITIAL = [
  { cx: 250, cy: 130 }, // Brand  (top)
  { cx: 250, cy: 400 }, // Product (middle)
  { cx: 250, cy: 670 }, // Tech   (bottom)
];

const M_FINAL = [
  { cx: 207, cy: 425 }, // Brand  (bottom-left)
  { cx: 250, cy: 350 }, // Product (top-center)
  { cx: 293, cy: 425 }, // Tech   (bottom-right)
];

const M_CENTER_X = (M_FINAL[0].cx + M_FINAL[1].cx + M_FINAL[2].cx) / 3;
const M_CENTER_Y = (M_FINAL[0].cy + M_FINAL[1].cy + M_FINAL[2].cy) / 3;

// ─── Shared ─────────────────────────────────────────────────────────
const LABELS = ["Brand", "Product", "Tech"];
const ACCENT = "#85c3ed";

// ─── Scroll mapping ranges (within 0-1 scrollYProgress) ─────────────
const CONVERGE_START = 0.15;
const CONVERGE_END = 0.5;
const FILL_START = 0.52;
const FILL_END = 0.62;

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

// ─── Component ───────────────────────────────────────────────────────
interface VennDiagramProps {
  progress: number;
  visible?: boolean;
  isMobile?: boolean;
  onFillComplete?: () => void;
}

export function VennDiagram({
  progress,
  visible = false,
  isMobile = false,
  onFillComplete,
}: VennDiagramProps) {
  const fillCompletedRef = useRef(false);

  const t = easeInOutCubic(
    clamp((progress - CONVERGE_START) / (CONVERGE_END - CONVERGE_START), 0, 1),
  );
  const f = easeOutCubic(
    clamp((progress - FILL_START) / (FILL_END - FILL_START), 0, 1),
  );

  // Fire onFillComplete once when fill reaches 1
  const stableOnFillComplete = useMemo(() => onFillComplete, [onFillComplete]);
  useEffect(() => {
    if (f >= 1 && !fillCompletedRef.current) {
      fillCompletedRef.current = true;
      stableOnFillComplete?.();
    }
  }, [f, stableOnFillComplete]);

  // Select geometry based on platform
  const r = isMobile ? M_R : R;
  const initial = isMobile ? M_INITIAL : INITIAL;
  const final_ = isMobile ? M_FINAL : FINAL;
  const vbW = isMobile ? M_VB_W : VB_W;
  const vbY = isMobile ? M_VB_Y : VB_Y;
  const vbH = isMobile ? M_VB_H : VB_H;
  const centerX = isMobile ? M_CENTER_X : CENTER_X;
  const centerY = isMobile ? M_CENTER_Y : CENTER_Y;

  const circles = initial.map((init, i) => ({
    cx: lerp(init.cx, final_[i].cx, t),
    cy: lerp(init.cy, final_[i].cy, t),
  }));

  return (
    <svg
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(8px)",
        transition: "opacity 1.2s ease, filter 1.2s ease",
      }}
      viewBox={`0 ${vbY} ${vbW} ${vbH}`}
      className="w-full max-w-2xl mx-auto mt-20"
      aria-label="Venn diagram of Brand, Product, and Tech"
    >
      <defs>
        <clipPath id="venn-clip-a">
          <circle cx={circles[0].cx} cy={circles[0].cy} r={r} />
        </clipPath>
        <clipPath id="venn-clip-b">
          <circle cx={circles[1].cx} cy={circles[1].cy} r={r} />
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
            r={r}
            fill={ACCENT}
            opacity={f}
            style={{
              transformOrigin: `${centerX}px ${centerY}px`,
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
          r={r}
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
