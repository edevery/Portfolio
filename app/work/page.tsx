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
    <div className="min-h-screen bg-black pt-24 pb-32">
      <WorkSection />
    </div>
  );
}
