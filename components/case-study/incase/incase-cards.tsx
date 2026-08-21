"use client";

import Image from "next/image";
import { cardClass, INCASE_ACCENT, insetClass, stackGapClass } from "./incase-tokens";

/** 11px / 700 / .1em eyebrow in Incase Blue tint (§2). */
export function IncaseEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-bold uppercase leading-none"
      style={{
        letterSpacing: ".1em",
        color: INCASE_ACCENT,
        fontFamily: "var(--font-inter)",
      }}
    >
      {children}
    </p>
  );
}

/** 30px / 1.5 feature line, capped at 1000px (§2). */
export function IncaseFeatureLine({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xl md:text-[30px] max-w-[1000px]"
      style={{
        lineHeight: 1.5,
        color: "#E4E4E7",
        textWrap: "pretty",
      }}
    >
      {children}
    </p>
  );
}

/** 15px / 1.65 sub-caption (§2). */
export function IncaseCaption({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[15px]"
      style={{ lineHeight: 1.65, color: "#A1A1AA", textWrap: "pretty" }}
    >
      {children}
    </p>
  );
}

/**
 * A #111 card holding an optional eyebrow and a feature line.
 * Covers §3.8 and the §3.12 intro; §3.6 passes children for its column grid.
 */
export function IncaseFeatureCard({
  eyebrow,
  feature,
  children,
}: {
  eyebrow?: string;
  feature: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${insetClass} ${stackGapClass}`}>
      <div className={`${cardClass} p-6 md:p-16`}>
        {eyebrow && (
          <div className="mb-5 md:mb-6">
            <IncaseEyebrow>{eyebrow}</IncaseEyebrow>
          </div>
        )}
        <IncaseFeatureLine>{feature}</IncaseFeatureLine>
        {children}
      </div>
    </div>
  );
}

/**
 * §3.6 — three hairline-separated columns beneath the feature line.
 * Columns stack on mobile, where the left border becomes a top border.
 */
export function IncaseThreeUp({
  columns,
}: {
  columns: { eyebrow: string; body: string }[];
}) {
  return (
    <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3">
      {columns.map((col, i) => (
        <div
          key={col.eyebrow}
          // The rule sits on top while the columns are stacked and switches to
          // the left edge once they sit side by side — never both at once.
          className={`py-6 md:py-0 md:px-14 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0 ${
            i === 0
              ? ""
              : "border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.12)]"
          }`}
        >
          <div className="mb-4">
            <IncaseEyebrow>{col.eyebrow}</IncaseEyebrow>
          </div>
          <IncaseCaption>{col.body}</IncaseCaption>
        </div>
      ))}
    </div>
  );
}

/** Full-bleed image card on a tinted plate — §3.5 and the §3.11 backdrop. */
export function IncaseImageCard({
  src,
  alt,
  background,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  background: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <div className={`${insetClass} ${stackGapClass}`}>
      <div
        className={`${cardClass} overflow-hidden`}
        style={{ backgroundColor: background }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, calc(100vw - 96px)"
        />
      </div>
    </div>
  );
}
