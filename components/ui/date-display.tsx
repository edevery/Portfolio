"use client";

import { useState } from "react";
import { AnimatedShinyText } from "./animated-shiny-text";

function formatDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  return `${month}.${day}.${year}`;
}

export function DateDisplay() {
  const [date] = useState(() => formatDate());

  return (
    <span className="fixed top-6 right-6 text-xs font-medium font-[family-name:var(--font-inter)] z-50">
      <AnimatedShinyText className="text-white/60">{date}</AnimatedShinyText>
    </span>
  );
}
