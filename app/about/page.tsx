import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About — Emily Devery",
  description:
    "Designer & Art Director based in NYC, working at the intersection of brand, product, and emerging technology.",
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return <AboutContent />;
}
