"use client";

import dynamic from "next/dynamic";

const WorkSection = dynamic(
  () => import("@/components/work-section").then((mod) => mod.WorkSection),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-black" />
  }
);

export default function Work() {
  return (
    <div className="min-h-screen bg-black pt-[58px] pb-32 max-md:h-[100dvh] max-md:overflow-hidden max-md:pb-0">
      <WorkSection />
    </div>
  );
}
