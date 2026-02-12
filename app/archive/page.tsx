import type { Metadata } from "next";
import ArchiveContent from "./archive-content";

export const metadata: Metadata = {
  title: "Archive — Emily Devery",
  description: "Archived projects and explorations.",
  alternates: {
    canonical: "/archive",
  },
};

export default function ArchivePage() {
  return <ArchiveContent />;
}
