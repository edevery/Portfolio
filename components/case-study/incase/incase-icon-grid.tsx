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
      <div className={`${cardClass} p-2 md:p-6`}>
        <div className="grid grid-cols-3 gap-2">
          {INCASE_CATEGORIES.map((cat, i) => {
            const on = activeIndex === i;
            return (
              <div
                key={cat.key}
                {...getSwatchProps(i)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: INCASE_SURFACE.warmPlate,
                  boxShadow: on
                    ? `inset 0 0 0 2px ${INCASE_SURFACE.penInk}, inset 0 14px 30px rgba(23,36,43,.16)`
                    : "inset 0 0 0 0 rgba(23,36,43,0), inset 0 0 0 rgba(23,36,43,0)",
                  transition: "box-shadow .3s ease",
                }}
              >
                <div
                  className="absolute inset-0 bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("/Work/Incase/cat-${cat.key}.png")`,
                    backgroundSize: "46% 46%",
                    transform: on
                      ? "translateY(-14px) scale(.94)"
                      : "translateY(0) scale(1)",
                    transition: "transform .4s cubic-bezier(.4,0,.2,1)",
                  }}
                  role="img"
                  aria-label={`${cat.label} folder icon`}
                />
                <div
                  className="absolute left-0 right-0 text-center text-[11px] font-bold uppercase"
                  style={{
                    bottom: 30,
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
    </div>
  );
}
