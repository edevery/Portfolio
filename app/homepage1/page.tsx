import type { Metadata } from "next";
import Homepage1Content from "./homepage1-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage1() {
  return <Homepage1Content />;
}
