import type { Metadata } from "next";
import { SlideDeck, type Slide } from "@/components/teaching/slide-deck";
import { BLOB_BASE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Fluency + Creative Workflows — Denver Ad School",
  description: "Teaching deck for AI Fluency + Creative Workflows at Denver Ad School.",
  robots: { index: false, follow: false },
};

const TOTAL_SLIDES = 44;

const videoOverrides: Record<number, Slide> = {
  43: {
    type: "video",
    src: `${BLOB_BASE}/Teaching/AIWorkflows/WhimsicalMeadow.mp4`,
    poster: "/teaching/AIWorkflows/slide-43.png",
  },
  44: {
    type: "video",
    src: `${BLOB_BASE}/Teaching/AIWorkflows/HummingbirdHarmony.mp4`,
    poster: "/teaching/AIWorkflows/slide-44.png",
  },
};

const slides: Slide[] = Array.from({ length: TOTAL_SLIDES }, (_, i) => {
  const slideNumber = i + 1;
  return (
    videoOverrides[slideNumber] ?? {
      type: "image" as const,
      src: `/teaching/AIWorkflows/slide-${String(slideNumber).padStart(2, "0")}.png`,
      alt: `Slide ${slideNumber}`,
    }
  );
});

export default function AIWorkflowsDeck() {
  return <SlideDeck slides={slides} title="AI Fluency + Creative Workflows" />;
}
