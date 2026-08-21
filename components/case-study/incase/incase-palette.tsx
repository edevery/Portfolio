"use client";

import { useColorSwatchInteraction } from "../use-color-swatch-interaction";
import { cardClass, INCASE_PALETTE, insetClass, stackGapClass } from "./incase-tokens";

/**
 * §3.9 — the locked brand palette.
 * Nothing is shown at rest; name and hex reveal on hover, and the swatch
 * lifts 6px.
 */
export function IncasePalette() {
  const { activeIndex, getSwatchProps } = useColorSwatchInteraction();

  return (
    <div className={`${insetClass} ${stackGapClass}`}>
      {/* The swatches bleed to the card edge, so the radius and clipping live on
          the grid — only the four outer corners round, and the card colour
          shows through as gutters rather than a frame. Same treatment as the
          social grid. */}
      <div
        className={`grid grid-cols-2 md:grid-cols-5 gap-2 overflow-hidden ${cardClass}`}
      >
        {INCASE_PALETTE.map((swatch, i) => {
          const on = activeIndex === i;
          return (
            <div
              key={swatch.hex}
              {...getSwatchProps(i)}
              className={`relative flex items-end cursor-pointer ${
                i === INCASE_PALETTE.length - 1 ? "max-md:col-span-2" : ""
              }`}
              style={{
                height: 260,
                padding: 22,
                background: swatch.hex,
                transform: on ? "translateY(-6px)" : "translateY(0)",
                transition: "transform .35s cubic-bezier(.4,0,.2,1)",
              }}
            >
              <div
                style={{
                  color: swatch.ink,
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(8px)",
                  transition:
                    "opacity .35s cubic-bezier(.4,0,.2,1), transform .35s cubic-bezier(.4,0,.2,1)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                <div
                  className="text-[11px] font-bold uppercase"
                  style={{ letterSpacing: ".1em" }}
                >
                  {swatch.name}
                </div>
                <div className="text-xs mt-[5px] opacity-60">{swatch.hex}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
