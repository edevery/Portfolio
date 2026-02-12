import type { Metadata } from "next";
import Homepage5Content from "./homepage5-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage5() {
  return <Homepage5Content />;
}
