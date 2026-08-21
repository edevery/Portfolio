"use client";

import { useColorSwatchInteraction } from "../use-color-swatch-interaction";
import {
  cardClass,
  INCASE_CATEGORIES,
  INCASE_SURFACE,
  insetClass,
  stackGapClass,
} from "./incase-tokens";

/**
 * §3.10 — the nine category icons.
 * At rest the card is just the icon on paper cream; on hover it gains an ink
 * ring and inner shadow, the icon lifts, and the label slides up.
 */
export function IncaseIconGrid() {
  const { activeIndex, getSwatchProps } = useColorSwatchInteraction();

  return (
    <div className={`${insetClass} ${stackGapClass}`}>
      {/* Cards bleed to the card edge, so the radius and clipping live on the
          grid — only the four outer corners round. Matches the palette. */}
      <div className={`grid grid-cols-3 gap-2 overflow-hidden ${cardClass}`}>
        {INCASE_CATEGORIES.map((cat, i) => {
          const on = activeIndex === i;
          return (
            <div
              key={cat.key}
              {...getSwatchProps(i)}
              className="relative flex aspect-square items-center justify-center overflow-hidden cursor-pointer"
              style={{
                background: INCASE_SURFACE.warmPlate,
                boxShadow: on
                  ? `inset 0 0 0 2px ${INCASE_SURFACE.penInk}, inset 0 14px 30px rgba(23,36,43,.16)`
                  : "inset 0 0 0 0 rgba(23,36,43,0), inset 0 0 0 rgba(23,36,43,0)",
                transition: "box-shadow .3s ease",
              }}
            >
              {/* A 46% square envelope with `contain` inside it — the icons are
                  not square (cat-health is 338x251), so sizing the background
                  to 46% 46% directly would stretch them to fit. */}
              <div
                className="bg-center bg-no-repeat bg-contain"
                style={{
                  width: "46%",
                  height: "46%",
                  backgroundImage: `url("/Work/Incase/cat-${cat.key}.png")`,
                  // -7% of the icon box resolves to the spec'd -14px at the
                  // design's 427px card, and stays proportional as cards shrink.
                  transform: on
                    ? "translateY(-7%) scale(.94)"
                    : "translateY(0) scale(1)",
                  transition: "transform .4s cubic-bezier(.4,0,.2,1)",
                }}
                role="img"
                aria-label={`${cat.label} folder icon`}
              />
              <div
                className="absolute left-0 right-0 text-center text-[10px] md:text-[11px] font-bold uppercase"
                style={{
                  // 7% is the spec'd 30px at the design's 427px card; as a
                  // percentage the label keeps its distance from the icon
                  // instead of creeping up on it as cards get narrower.
                  bottom: "7%",
                  letterSpacing: ".14em",
                  color: INCASE_SURFACE.penInk,
                  fontFamily: "var(--font-inter)",
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(10px)",
                  transition:
                    "opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1)",
                }}
              >
                {cat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
