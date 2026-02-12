import type { Metadata } from "next";
import Homepage8Content from "./homepage8-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage8() {
  return <Homepage8Content />;
}
