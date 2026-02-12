import type { Metadata } from "next";
import Homepage2Content from "./homepage2-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage2() {
  return <Homepage2Content />;
}
