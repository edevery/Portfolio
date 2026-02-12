import type { Metadata } from "next";
import Homepage4Content from "./homepage4-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage4() {
  return <Homepage4Content />;
}
