"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HomepageLayout from "@/components/layout/homepage-layout";
import { IntersectionSection } from "@/components/home/intersection-section";

const EmilyMsdfCanvasV5 = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas-v5"),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />
  }
);

const Ballpit = dynamic(() => import("@/components/Ballpit"), { ssr: false });

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-8 left-8 z-50 flex items-center gap-2 text-white/50 text-xs tracking-[0.15em] uppercase"
      style={{
        fontFamily: "var(--font-heading)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }}
    >
      <svg
        className="w-3 h-3 animate-bounce"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4.5L6 8.5L10 4.5" />
      </svg>
      <span>Scroll</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ScrollIndicator />
      <HomepageLayout>
        <EmilyMsdfCanvasV5 circleSize={0.25} circleEdge={0.3} borderSize={0.45} />
      </HomepageLayout>
      <IntersectionSection />
      <div className="relative w-full h-[100vh] bg-black">
        <Ballpit
          count={150}
          gravity={1.6}
          friction={0.956}
          wallBounce={0.95}
          followCursor
          colors={["#b2d6f7", "#9ebcdd", "#738ba0", "#5f7d99"]}
        />
      </div>
    </>
  );
}
