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
  linkLabel?: string;
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
  logo?: string; // Path to logo image for case study page
  logoClassName?: string; // Custom class for logo sizing
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
    logo: "/Work/Vesta/Vesta/VestaLogoGradient.png",
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
    logo: "/Work/Comcast Business/ComcastBusinessLogo.png",
    role: "Art Director",
    context: "Brand system overhaul for Comcast's B2B division.",
    sections: [
      { id: "role", label: "Role", content: "Led three brand workshops with the Comcast Business brand team. Evolved the visual identity, developed new brand guidelines, and worked with partner agencies to roll out the new brand system across digital, social, print, OOH, and TV. Designed custom end cards and a scalable tagging toolkit." },
      { id: "background", label: "Background", content: "Comcast Business was a new entrant in a crowded market. The challenge was to build credibility without blending in entirely. The system needed to flex across global touchpoints while remaining cohesive." },
      { id: "solution", label: "Solution", content: "A system that adapts, grows, and evolves—bringing to life Comcast Business's purpose of keeping companies ready for what's next, with a human touch." },
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
    logo: "/Work/LinkLogistics/LinkLogisticsLogo.png",
    role: "Brand Designer",
    context: "Comprehensive identity system for a Fortune 500 logistics company.",
    sections: [
      { id: "role", label: "Role", content: "Designed the visual identity and scalable brand system.\n\nDeveloped brand and digital guidelines, a modular mapping system, and a motion toolkit used across digital platforms, property visualizations, signage, keynote events, and app design." },
      { id: "background", label: "Background", content: "Link Logistics is the largest logistics real estate owner in the U.S.\n\nAs e-commerce accelerated, demand for warehouse space began to outpace supply, pushing the category toward increased competition and differentiation. Despite this shift, most logistics real estate brands remained purely functional and visually interchangeable." },
      { id: "insight", label: "Insight", content: "Every business owner imagines their warehouse as a space to grow, but Link is the first landlord to think that way. Rather than selling square footage, Link positions itself as an active partner in its tenants' growth." },
      { id: "solution", label: "Solution", content: "Inspired by architectural blueprints and Link's mission to provide adaptable space, I translated the idea of Space to Grow into a flexible visual system built around the container—one of the most recognizable elements of the supply chain. By varying the container's orientation and scale, the system forms a modular grid that functions like a blueprint: expandable, buildable, and customizable. The modularity of this system is a graphic display of the flexibility Link offers." },
      { id: "results", label: "Results", content: "39M sq ft in leases and renewals\n92% employee retention\n3.2% social growth" },
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
    logo: "/Work/Instacart/InstacartLogo.png",
    logoClassName: "h-12 md:h-20 lg:h-24",
    role: "Art Director",
    context: "Launch campaign for Instacart's refreshed brand positioning.",
    sections: [
      { id: "role", label: "Role", content: "Campaign identity and visual system.\nArt direction for photoshoot.\nDesign across digital and out-of-home." },
      { id: "background", label: "Background", content: "Instacart's debut brand campaign launched toward the end of the pandemic, as meal delivery services surged and convenience became the dominant narrative.\n\nAt the same time, caregivers were carrying more responsibility than ever, balancing work, family, and the emotional labor of making mealtime happen." },
      { id: "insight", label: "Insight", content: "You can't deliver homemade.\n\nWhat people wanted wasn't just convenience, but connection. Home-cooked meals carry care and culture, yet the work of making them often falls on already-stretched caregivers.\n\nInstacart becomes the unseen ingredient that helps homemade happen." },
      { id: "solution", label: "Solution", content: "How Homemade Is Made positioned Instacart as a partner in the making process, not a replacement for it.\n\nThe campaign celebrated the effort behind home-cooked meals while pairing emotional storytelling with real utility. Each execution highlighted the ingredients and steps behind meaningful dishes and integrated QR codes that led directly to cartable recipes, placing everything needed to make the meal into the user's Instacart cart.\n\nAcross digital and out-of-home, the system reinforced Instacart's role in quietly removing friction so people could focus on sharing care through food." },
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
    logo: "/Work/BMW/BMWLogo.png",
    role: "Visual Identity & Experience Designer",
    context: "2024 BMW Championship at Castle Pines Golf Course.",
    sections: [
      { id: "role", label: "Role", content: "Developed the BMW Championship visual identity and designed the event ecosystem, including course signage, invitations, vehicle displays, and on-site activations." },
      { id: "background", label: "Background", content: "Fifty of the world's best golfers compete in the BMW Championship, but only one earns the title. In 2024, the tournament returned to Castle Pines Golf Course, a course defined by elevation, precision, and unforgiving terrain.\n\nBMW and championship golf share a belief: excellence is decided in the details." },
      { id: "insight", label: "Insight", content: "At the highest level, greatness is quiet and precise.\n\n\nEvery lie shapes the shot.\nEvery approach shapes the round.\nEvery round shapes the champion.\n\nThe Ultimate Driving Machine reflects the same philosophy—performance defined by restraint, control, and craft." },
      { id: "solution", label: "Solution", content: "I developed the tournament identity around a single idea: there can only be one ultimate.\n\n\nThe visual system draws from tight crops of the BMW Championship trophy, whose sculptural silhouette echoes fine German craftsmanship. Sleek gradients, disciplined composition, and controlled contrast express competitive tension with elegance.\n\nThe identity scaled across signage, invitations, vehicle integrations, and fan-facing activations. Originally developed for the 2024 BMW Championship at Castle Pines, the work was embraced for its premium feel and alignment with BMW's brand \"blue thread,\" and was subsequently evolved across BMW's 2025 golf sponsorships, including Caves Valley and Ryder Cup." },
      { id: "impact", label: "Impact", content: "Named the best tournament of the PGA TOUR 2024.\n\nThe work reinforced BMW's position as a brand where precision, performance, and distinction meet on the course and beyond.", link: "https://www.pgatour.com/article/news/company/2024/12/12/bmw-championship-named-pga-tour-tournament-of-the-year-for-record-sixth-time", linkLabel: "Article" },
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
    logo: "/Work/BMW/BMWLogo.png",
    role: "Illustrator & Experience Designer",
    context: "Event identity for BMW's Indian Wells Tennis Garden sponsorship.",
    sections: [
      { id: "role", label: "Role", content: "Illustrated the tennis-meets-motorsport visual language and developed the event identity across vehicle back walls, digital placements, and on-site activations. Worked closely with Cekai Studio to bring my storyboards to life across LED boards and jumbotrons throughout the grounds." },
      { id: "background", label: "Background", content: "Indian Wells is defined by light, color, and fun. The challenge was to translate BMW's precision and performance into a language that felt native to the environment." },
      { id: "platform", label: "Platform", content: "Powered by Precision\n\n\nRigorous dedication to craft.\nAn unending obsession with detail.\nExcellence achieved through a precise balance of elegance and power.\n\nIt's what defines BMW as the Ultimate Driving Machine, and what shapes the experience of Indian Wells." },
      { id: "solution", label: "Solution", content: "I developed a visual identity that brought a sense of energy and play to BMW's performance DNA, seamlessly blending the dynamic curvature of driving with iconic tennis elements.\n\n\nThe illustrations strike a balance between athleticism and elegance, evoking motion, precision, and performance. A vibrant palette and expressive movement respond to the light and energy of Indian Wells, while disciplined geometry and controlled composition anchor the work in BMW's luxury sensibility.\n\nThe system extended across animated LED boards and jumbotrons, bold vehicle display back walls, and digital placements throughout Indian Wells Tennis Garden. In motion and in space, the work integrated BMW into the destination's atmosphere in a way that felt playful, refined, and unmistakably BMW." },
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
    logo: "/Work/Zaxby's/ZaxbysLogo.png",
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
    logo: "/Work/MeritSystems/MeritIcon.png",
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
    logo: "/Work/ItAllStartsHere/ItAllStartsHereLogo.png",
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
