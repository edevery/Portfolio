"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyMsdfCanvas = dynamic(
  () => import("@/components/canvas/emily-msdf-canvas"),
  { ssr: false }
);

export default function Homepage3Content() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvas circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
    </HomepageLayout>
  );
}
