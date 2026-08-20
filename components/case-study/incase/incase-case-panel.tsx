"use client";

import { useState, useSyncExternalStore } from "react";
import { FOLDER_RAMP, INCASE_SURFACE } from "./incase-tokens";

/**
 * §3.7 left — the Case, hover to open.
 * Nine folders lift out of a brown case with spring easing and a 24ms
 * front-to-back stagger, so the back folder travels furthest.
 */

/** Shared callout pill used by both animation panels (§3.7). */
export function IncaseCalloutPill({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div
      className="absolute top-7 left-7 z-30 flex items-center gap-2 rounded-full"
      style={{
        padding: "8px 14px",
        border: "1px solid rgba(23,36,43,.2)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".14em",
        color,
        fontFamily: "var(--font-inter)",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: color,
        }}
      />
      {label}
    </div>
  );
}

const CASE_CLIP =
  "path('M14,0 L286,0 Q300,0 300,14 L300,113 Q300,137 276,137 L24,137 Q0,137 0,113 L0,14 Q0,0 14,0 Z')";

const HOVERLESS = "(hover: none)";

/** Subscribes to the hover media query without a setState-in-effect round trip. */
function useIsTouch() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(HOVERLESS);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(HOVERLESS).matches,
    () => false // assume hover on the server; corrected at hydration
  );
}

export function IncaseCasePanel() {
  const [open, setOpen] = useState(false);
  // §6: no hover on touch, so the Case rests in its open state there.
  const isTouch = useIsTouch();

  const lifted = open || isTouch;

  return (
    <div
      className="relative flex flex-col justify-center overflow-hidden rounded-2xl md:rounded-3xl p-8 md:p-14"
      style={{
        background: INCASE_SURFACE.warmPlate,
        minHeight: 560,
      }}
    >
      <IncaseCalloutPill label="HOVER" color="#A77942" />

      <div className="flex justify-center">
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          /* The stage is built at a fixed 396x360, so it must not flex-shrink —
             scale it down on narrow screens instead, or the absolutely
             positioned case and folders overflow and get clipped. */
          className="relative cursor-pointer shrink-0 scale-[0.66] md:scale-90"
          style={{
            width: 396,
            height: 360,
            transformOrigin: "50% 100%",
          }}
        >
          {/* Ground shadow */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: 318,
              width: 250,
              height: 24,
              transform: "translateX(-50%)",
              background: "rgba(23,36,43,.14)",
              borderRadius: "50%",
              filter: "blur(7px)",
              zIndex: 0,
            }}
          />

          {/* Handle, tucked behind the case */}
          <svg
            viewBox="0 0 130 62"
            width={117}
            height={56}
            className="absolute"
            style={{ left: 140, top: 40, zIndex: 0 }}
            aria-hidden
          >
            <path
              d="M8 60 L8 28 Q8 8 65 8 Q122 8 122 28 L122 60 L104 60 L104 30 Q104 18 65 18 Q26 18 26 30 L26 60 Z"
              fill="#A77942"
              stroke="#17242B"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </svg>

          {/* Case back */}
          <div
            className="absolute"
            style={{
              left: 48,
              top: 90,
              width: 300,
              height: 215,
              background: "#A77942",
              border: "2.5px solid #17242B",
              borderRadius: 24,
              zIndex: 1,
            }}
          />

          {/* Nine folders — index 0 is the back-most, so it travels furthest */}
          {FOLDER_RAMP.map((col, i) => {
            const fromBack = 8 - i;
            return (
              <div
                key={col}
                className="absolute"
                style={{
                  left: 58,
                  top: 92,
                  width: 280,
                  height: 215,
                  transformOrigin: "50% 100%",
                  transform: `translate(0px, ${lifted ? -(fromBack * 16) : 0}px)`,
                  transition: `transform .6s cubic-bezier(.34,1.56,.64,1) ${
                    (lifted ? 80 : 0) + fromBack * 24
                  }ms`,
                  zIndex: i,
                }}
              >
                <svg
                  viewBox="0 0 280 215"
                  width={280}
                  height={215}
                  className="absolute inset-0 block"
                  style={{ overflow: "visible" }}
                  aria-hidden
                >
                  <path
                    d="M5 32 Q5 22 15 22 L90 22 Q95 22 97.6 26.3 L104 37 L265 37 Q275 37 275 47 L275 198 Q275 210 263 210 L17 210 Q5 210 5 198 Z"
                    fill={col}
                    stroke="#17242B"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 56 L263 56 Q275 56 275 67 L275 198 Q275 210 263 210 L17 210 Q5 210 5 198 Z"
                    fill="#F4EDE1"
                    stroke="#17242B"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            );
          })}

          {/* Case front — clipped so folders slide behind it */}
          <div
            className="absolute"
            style={{
              left: 48,
              top: 168,
              width: 300,
              height: 137,
              background: "#A77942",
              border: "2.5px solid #17242B",
              borderRadius: "14px 14px 24px 24px",
              zIndex: 20,
              clipPath: CASE_CLIP,
              WebkitClipPath: CASE_CLIP,
            }}
          />
        </div>
      </div>
    </div>
  );
}
