"use client";

import { INCASE_SOCIAL_ORDER, INCASE_SURFACE, insetClass, stackGapClass } from "./incase-tokens";

/**
 * §3.12 — the launch social system.
 * Only the four outer corners round, so the radius lives on the grid and the
 * 3px gutters read as hairlines between posts.
 */
export function IncaseSocialGrid() {
  return (
    <div className={`${insetClass} ${stackGapClass}`}>
      <div
        className="grid grid-cols-3 overflow-hidden rounded-2xl md:rounded-3xl"
        style={{ gap: 3 }}
      >
        {INCASE_SOCIAL_ORDER.map((n) => (
          <div
            key={n}
            className="bg-center bg-cover"
            style={{
              aspectRatio: "4 / 5",
              backgroundColor: INCASE_SURFACE.warmPlate,
              backgroundImage: `url("/Work/Incase/social-${n}.png")`,
            }}
            role="img"
            aria-label="Incase launch social post"
          />
        ))}
      </div>
    </div>
  );
}
