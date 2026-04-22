"use client";

import dynamic from "next/dynamic";
import type { Category } from "@/lib/work-data";

const WorkSection = dynamic(
  () => import("@/components/work-section").then((mod) => mod.WorkSection),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-black" />
  }
);

interface WorkContentProps {
  initialCategory?: Category;
}

export default function WorkContent({ initialCategory }: WorkContentProps = {}) {
  return (
    <div className="min-h-screen bg-black pt-[58px] pb-32 max-md:h-[100dvh] max-md:overflow-hidden max-md:pb-0">
      <WorkSection initialCategory={initialCategory} />
    </div>
  );
}
