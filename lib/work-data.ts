export type Category =
  | "all"
  | "product"
  | "identity"
  | "graphic"
  | "illustration"
  | "experiential"
  | "art direction"
  | "generative";

export interface ProjectSection {
  id: string;
  label: string;
  content: string;
  link?: string;
}

export interface WorkItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: Category[];
  image: string;
  heroMedia: {
    type: "image" | "video";
    src: string;
    poster?: string; // For video thumbnails
  };
  accentColor: string;
  role: string;
  context: string;
  sections: ProjectSection[];
  className?: string;
}

export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "identity", label: "Identity" },
  { id: "product", label: "Product" },
  { id: "experiential", label: "Experiential" },
  { id: "art direction", label: "Art Direction" },
  { id: "generative", label: "Generative" },
  { id: "illustration", label: "Illustration" },
  { id: "graphic", label: "Graphic" },
];

export const workItems: WorkItem[] = [
  {
    id: "1",
    slug: "vesta",
    title: "Vesta",
    description: "An AI-powered companion to help couples stay close with personalized nudges and insights into how their partner loves.",
    categories: ["product", "identity", "generative"],
    image: "/Thumbnails/Vesta.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/Vesta.png",
    },
    accentColor: "#fe9f28",
    role: "Founder & Designer",
    context: "A personal project built end-to-end over 6 months, outside my full-time agency role.",
    sections: [
      {
        id: "role",
        label: "Role",
        content: "Founder & Designer. I designed and built Vesta end-to-end: product strategy, brand identity, UI/UX, and development using AI tools like Claude Code and Cursor. A true passion project, built outside my full-time agency role.",
      },
      {
        id: "background",
        label: "Background",
        content: "I woke up one morning with an idea I couldn't shake, and for the first time, AI tools existed to build it myself. Not through work, not with a team. Just me. I worked on it before work and through weekends for six months. But the effort never felt like effort. It felt like building something that should exist.",
      },
      {
        id: "insight",
        label: "Insight",
        content: "Most relationships don't fade from a lack of love. They fade from a lack of tending. Date nights slip. Needs go unspoken. Small gestures get lost in the noise, and connection fades quietly in the background. Frameworks like love languages and attachment styles are powerful, but only if we remember to use them in real-time.",
      },
      {
        id: "solution",
        label: "Solution",
        content: "Vesta bridges the gap between what we know about the people we love and our ability to act on that knowledge. Every interaction, from the Daily Flame to the Devotion Rings, was designed to feel less like an app and more like a quiet companion. A warm, human presence to help us love each other a little better.",
      },
      {
        id: "demo",
        label: "Demo",
        content: "Experience Vesta for yourself at vestalove.app",
        link: "https://vestalove.app",
      },
    ],
    className: "md:col-span-2",
  },
  {
    id: "2",
    slug: "comcast-business",
    title: "Comcast Business",
    description: "A flexible brand system designed to evolve with business.",
    categories: ["identity", "art direction", "graphic"],
    image: "/Thumbnails/ComcastBusiness.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/ComcastBusiness.png",
    },
    accentColor: "#7eecb4",
    role: "Art Director",
    context: "Brand system overhaul for Comcast's B2B division.",
    sections: [
      { id: "role", label: "Role", content: "Art Director leading visual identity and brand system development." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-1",
  },
  {
    id: "3",
    slug: "link-logistics",
    title: "Link Logistics",
    description: "A modular brand system designed to scale with America's largest logistics real estate company.",
    categories: ["identity", "art direction", "graphic"],
    image: "/Thumbnails/LinkLogistics.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/LinkLogistics.png",
    },
    accentColor: "#f97316",
    role: "Brand Designer",
    context: "Comprehensive identity system for a Fortune 500 logistics company.",
    sections: [
      { id: "role", label: "Role", content: "Brand Designer leading identity system development." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-1",
  },
  {
    id: "4",
    slug: "instacart",
    title: "Instacart",
    description: "Debut brand campaign revealing the secret ingredient behind home-cooked meals.",
    categories: ["identity", "art direction"],
    image: "/Thumbnails/Instacart.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/Instacart.png",
    },
    accentColor: "#16a34a",
    role: "Art Director",
    context: "Launch campaign for Instacart's refreshed brand positioning.",
    sections: [
      { id: "role", label: "Role", content: "Art Director for brand campaign." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-1",
  },
  {
    id: "5",
    slug: "bmw-championship",
    title: "BMW Championship",
    description: "Experiential design built around ultimate performance.",
    categories: ["art direction", "experiential", "identity"],
    image: "/Thumbnails/BMWChampionship.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/BMWChampionship.png",
    },
    accentColor: "#1a1a1a",
    role: "Experience Designer",
    context: "On-site experiential design for BMW's flagship golf sponsorship.",
    sections: [
      { id: "role", label: "Role", content: "Experience Designer for on-site activations." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-1",
  },
  {
    id: "6",
    slug: "bmw-indian-wells",
    title: "BMW",
    description: "Tennis-meets-motorsport identity designed for Indian Wells.",
    categories: ["illustration", "identity", "art direction", "experiential"],
    image: "/Thumbnails/BMW.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/BMW.png",
    },
    accentColor: "#0ea5e9",
    role: "Lead Designer",
    context: "Event identity merging BMW's motorsport heritage with tennis culture.",
    sections: [
      { id: "role", label: "Role", content: "Lead Designer for event identity." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-2",
  },
  {
    id: "7",
    slug: "zaxbys",
    title: "Zaxbys",
    description: "QSR system bringing cohesion to constant change.",
    categories: ["art direction"],
    image: "/Thumbnails/Zaxbys.jpg",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/Zaxbys.jpg",
    },
    accentColor: "#ea580c",
    role: "Art Director",
    context: "Brand guidelines and asset system for a fast-casual restaurant chain.",
    sections: [
      { id: "role", label: "Role", content: "Art Director for brand guidelines." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-1",
  },
  {
    id: "8",
    slug: "merit-systems",
    title: "Merit Systems",
    description: "Foundational brand identity for an open-source economics platform.",
    categories: ["identity", "product"],
    image: "/Thumbnails/MeritSystems.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/MeritSystems.png",
    },
    accentColor: "#7c3aed",
    role: "Brand Designer",
    context: "Identity design for a Web3 economics platform.",
    sections: [
      { id: "role", label: "Role", content: "Brand Designer for Web3 identity." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-1",
  },
  {
    id: "9",
    slug: "it-all-starts-here",
    title: "It All Starts Here",
    description: "A citywide campaign celebrating San Francisco's enduring influence on innovation.",
    categories: ["art direction", "experiential", "generative"],
    image: "/Thumbnails/ItAllStartsHere.png",
    heroMedia: {
      type: "image",
      src: "/Thumbnails/ItAllStartsHere.png",
    },
    accentColor: "#dc2626",
    role: "Creative Director",
    context: "Multi-touchpoint campaign for SF Travel celebrating the city's innovation legacy.",
    sections: [
      { id: "role", label: "Role", content: "Creative Director for citywide campaign." },
      { id: "background", label: "Background", content: "Project background coming soon." },
      { id: "insight", label: "Insight", content: "Project insight coming soon." },
      { id: "solution", label: "Solution", content: "Project solution coming soon." },
    ],
    className: "md:col-span-2",
  },
];

export function getWorkItemBySlug(slug: string): WorkItem | undefined {
  return workItems.find((item) => item.slug === slug);
}

export function getAllSlugs(): string[] {
  return workItems.map((item) => item.slug);
}
