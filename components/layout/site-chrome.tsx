"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { DateDisplay } from "@/components/ui/date-display";
import { TitleDisplay } from "@/components/ui/title-display";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { CustomCursor } from "@/components/ui/custom-cursor";

const CHROMELESS_PREFIXES = ["/edevery"];

export function SiteChrome() {
  const pathname = usePathname() ?? "";
  const hideChrome = CHROMELESS_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (hideChrome) {
    return <CustomCursor />;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[58px] bg-gradient-to-b from-black from-[48px] to-transparent z-40 pointer-events-none" />
      <span className="fixed top-6 left-6 text-xs font-medium font-[family-name:var(--font-inter)] z-50">
        <AnimatedShinyText className="text-white/60">Made in NYC</AnimatedShinyText>
      </span>
      <TitleDisplay />
      <DateDisplay />
      <Navbar />
      <CustomCursor />
    </>
  );
}
