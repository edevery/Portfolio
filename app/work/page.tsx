import type { Metadata } from "next";
import WorkContent from "./work-content";

export const metadata: Metadata = {
  title: "Work — Emily Devery",
  description:
    "Selected work across brand, product, and emerging technology.",
  alternates: {
    canonical: "/work",
  },
};

export default function Work() {
  return <WorkContent />;
}
