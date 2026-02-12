import type { Metadata } from "next";
import Homepage3Content from "./homepage3-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage3() {
  return <Homepage3Content />;
}
