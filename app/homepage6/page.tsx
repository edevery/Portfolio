import type { Metadata } from "next";
import Homepage6Content from "./homepage6-content";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function Homepage6() {
  return <Homepage6Content />;
}
