"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyMsdfCanvasV5 = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas-v5"),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />
  }
);

export default function Home() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV5 circleSize={0.25} circleEdge={0.3} borderSize={0.45} />
    </HomepageLayout>
  );
}
