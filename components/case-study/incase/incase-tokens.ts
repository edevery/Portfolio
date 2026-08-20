// Design tokens for the Incase case study (handoff §2).
// Kept in one place so the bespoke Incase blocks stay consistent with each other.

export const INCASE_ACCENT = "#85C3ED";

/** Brand palette, in the order it appears in the §3.9 swatch row. */
export const INCASE_PALETTE = [
  { name: "Incase Blue", hex: "#005679", ink: "#F4EDE1" },
  { name: "Blueprint Blue", hex: "#BADAE0", ink: "#17242B" },
  { name: "Case Brown", hex: "#A77942", ink: "#F4EDE1" },
  { name: "Paper Cream", hex: "#F4EDE1", ink: "#17242B" },
  { name: "Pen Ink", hex: "#17242B", ink: "#F4EDE1" },
] as const;

/** Nine folder colors, back-to-front. Shared by both folder animations (§3.7). */
export const FOLDER_RAMP = [
  "#005679",
  "#1A6B88",
  "#347F98",
  "#4E93A7",
  "#68A7B6",
  "#82BBC5",
  "#9CCFD4",
  "#B0DAE0",
  "#C6E4E8",
] as const;

/** Surfaces that aren't part of the locked brand palette. */
export const INCASE_SURFACE = {
  heroPlate: "#F3ECE2",
  coolPlate: "#DCE6EA",
  warmPlate: "#F4EDE1",
  penInk: "#17242B",
} as const;

/**
 * The nine categories, in §3.10 grid order (which is deliberately not the
 * §3.6 reading order).
 */
export const INCASE_CATEGORIES = [
  { key: "about", label: "About" },
  { key: "health", label: "Health" },
  { key: "home", label: "Home" },
  { key: "pets", label: "Pets" },
  { key: "passwords", label: "Passwords" },
  { key: "finances", label: "Finances" },
  { key: "estate", label: "Estate" },
  { key: "keepsakes", label: "Keepsakes" },
  { key: "wishes", label: "Wishes" },
] as const;

/** §3.12 — order is art-directed, not numeric. Do not re-sort. */
export const INCASE_SOCIAL_ORDER = [
  "03",
  "09",
  "02",
  "04",
  "05",
  "11",
  "08",
  "01",
  "13",
  "10",
  "07",
  "12",
] as const;

/** Card shell: #111 at 24px radius, dropping to 16px on mobile per §6. */
export const cardClass = "rounded-2xl md:rounded-3xl bg-[#111111]";

/** Standard page inset — 16px on mobile, 48px from md up (§2, §6). */
export const insetClass = "px-4 md:px-12";

/** 24px vertical rhythm between cards (§2), tightened on mobile. */
export const stackGapClass = "mb-4 md:mb-6";

export const hairline = "rgba(255,255,255,.12)";
