"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilySdfCanvas = dynamic(
  () => import("@/components/canvas/emily-sdf-canvas"),
  { ssr: false }
);

export default function Homepage2Content() {
  return (
    <HomepageLayout>
      <EmilySdfCanvas circleSize={0.3} circleEdge={0.15} borderSize={0.45} />
    </HomepageLayout>
  );
}
