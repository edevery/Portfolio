"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyMsdfCanvasV3 = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas-v3"),
  { ssr: false }
);

export default function Homepage6Content() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV3 circleSize={0.35} circleEdge={0.55} borderSize={0.45} />
    </HomepageLayout>
  );
}
