"use client";

import { WordRotate } from "./word-rotate";
import { AnimatedShinyText } from "./animated-shiny-text";

export function TitleDisplay() {
  return (
    <span className="flex fixed top-6 left-1/2 -translate-x-1/2 text-xs font-medium font-[family-name:var(--font-inter)] z-50 items-baseline">
      <AnimatedShinyText className="text-white/60 flex items-baseline">
        <span className="w-[70px] text-right inline-flex justify-end">
          <WordRotate words={["Brand", "Product", "Graphic", "Experience"]} duration={3500} />
        </span>
        <span className="ml-1">Designer</span>
      </AnimatedShinyText>
    </span>
  );
}
