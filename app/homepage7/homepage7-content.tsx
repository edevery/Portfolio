"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyMsdfCanvasV4 = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas-v4"),
  { ssr: false }
);

export default function Homepage7Content() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV4 circleSize={0.25} circleEdge={0.3} borderSize={0.45} />
    </HomepageLayout>
  );
}
