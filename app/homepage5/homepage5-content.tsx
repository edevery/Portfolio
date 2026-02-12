"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyMsdfCanvasV2 = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas-v2"),
  { ssr: false }
);

export default function Homepage5Content() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV2 circleSize={0.35} circleEdge={0.55} borderSize={0.45} />
    </HomepageLayout>
  );
}
