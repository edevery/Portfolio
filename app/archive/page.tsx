"use client";

import dynamic from "next/dynamic";

const ArchiveSection = dynamic(
  () => import("@/components/archive-section").then((mod) => mod.ArchiveSection),
  {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-black" />
  }
);

export default function ArchivePage() {
  return <ArchiveSection />;
}
