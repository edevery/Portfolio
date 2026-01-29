"use client";

import dynamic from "next/dynamic";
import HomepageLayout from "@/components/layout/homepage-layout";

const EmilyCanvas = dynamic(
  () => import("@/components/canvas/emily-canvas"),
  { ssr: false }
);

export default function Homepage1() {
  return (
    <HomepageLayout>
      <EmilyCanvas />
    </HomepageLayout>
  );
}
