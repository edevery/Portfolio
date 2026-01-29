"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyMsdfCanvasV1 = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas-v1"),
  { ssr: false }
);

export default function Homepage4() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV1 circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
    </HomepageLayout>
  );
}
