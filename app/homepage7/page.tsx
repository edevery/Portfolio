import type { Metadata } from "next";
import Homepage7Content from "./homepage7-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage7() {
  return <Homepage7Content />;
}
