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
      type: "video",
      src: "/Work/Vesta/Vesta/VestaVideo1920x1080.mp4",
      poster: "/Thumbnails/Vesta.png",
    },
    accentColor: "#fe9f28",
    logo: "/Work/Vesta/Vesta/Vesta_Favicon.png",
    logoClassName: "h-24 md:h-32 lg:h-40 !aspect-square",
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
      type: "video",
      src: "/Work/Comcast%20Business/BrandVideo.mp4",
      poster: "/Thumbnails/ComcastBusiness.png",
    },
    accentColor: "#7eecb4",
    logo: "/Work/Comcast%20Business/ComcastBusinessLogoBlue.png",
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
      type: "video",
      src: "/Work/LinkLogistics/SpacetoGrow.mp4",
      poster: "/Thumbnails/LinkLogistics.png",
    },
    accentColor: "#f97316",
    logo: "/Work/LinkLogistics/LinkLogisticsLogo.png",
    role: "Brand Designer",
    context: "Comprehensive identity system for a Fortune 500 logistics company.",
    sections: [
      { id: "role", label: "Role", content: "Designed the visual identity and scalable brand system.\n\nDeveloped brand and digital guidelines, a modular mapping system, and a motion toolkit used across digital platforms, property visualizations, signage, keynote events, and app design." },
      { id: "background", label: "Background", content: "Link Logistics is the largest logistics real estate owner in the U.S.\n\nAs e-commerce accelerated, demand for warehouse space began to outpace supply, pushing the category toward increased competition and differentiation. Despite this shift, most logistics real estate brands remained purely functional and visually interchangeable." },
      { id: "insight", label: "Insight", content: "Every business owner imagines their warehouse as a space to grow, but Link is the first landlord to think that way. Rather than selling square footage, Link positions itself as an active partner in its tenants' growth." },
      { id: "solution", label: "Solution", content: "Inspired by architectural blueprints and Link's mission to provide adaptable space, I translated the idea of Space to Grow into a flexible visual system built around one of the most recognizable elements of the supply chain: the container.\n\nBy changing the container's orientation and scale, a unique grid is formed and acts as a blueprint that can be built with and filled in.\n\nThe modularity of this system is a graphic display of the flexibility Link offers." },
      { id: "results", label: "Results", content: "39M sq ft in leases and renewals\n92% employee retention\n3.2% social growth" },
    ],
    className: "md:col-span-1",
  },
  {
    id: "4",
    slug: "instacart",
    title: "Instacart",
    description: "Instacart's debut brand campaign revealing the secret ingredient behind home-cooked meals.",
    categories: ["identity", "art direction"],
    image: "/Thumbnails/Instacart.png",
    heroMedia: {
      type: "video",
      src: "/Work/Instacart/Hero_IndianSpice.mov",
      poster: "/Thumbnails/Instacart.png",
    },
    accentColor: "#16a34a",
    logo: "/Work/Instacart/InstacartLogo.png",
    logoClassName: "h-14 md:h-24 lg:h-28",
    role: "Art Director",
    context: "Launch campaign for Instacart's refreshed brand positioning.",
    sections: [
      { id: "role", label: "Role", content: "Campaign identity and visual system.\nArt direction for photoshoot.\nDesign across digital and out-of-home." },
      { id: "background", label: "Background", content: "Instacart's debut brand campaign launched toward the end of the pandemic, as meal delivery services surged and convenience became the dominant narrative.\n\nAt the same time, caregivers were carrying more responsibility than ever, balancing work, family, and the emotional labor of making mealtime happen." },
      { id: "insight", label: "Insight", content: "You can't deliver homemade.\n\nWhat people want isn't just convenience, but connection. Home-cooked meals carry care and culture, yet the work of making them often falls on already-stretched caregivers.\n\nInstacart becomes the unseen ingredient that helps homemade happen." },
      { id: "solution", label: "Solution", content: "*How Homemade Is Made* reframed Instacart as a partner in the making of home-cooked meals.\n\nEach execution celebrated the effort behind cooking while turning emotion into action through QR-linked, cartable recipes.\n\nThe system consistently showed how Instacart removes friction so people can focus on sharing care through food." },
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
      src: "/work/BMW/BMW Championship/Hero.png",
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
      type: "video",
      src: "/Work/BMW/BMW Tennis/HeroVideo.mp4",
      poster: "/Thumbnails/BMW.png",
    },
    accentColor: "#0ea5e9",
    logo: "/Work/BMW/BMWLogo.png",
    logoClassName: "h-10 md:h-14 lg:h-20",
    role: "Illustrator & Experience Designer",
    context: "Event identity for BMW's Indian Wells Tennis Garden sponsorship.",
    sections: [
      { id: "role", label: "Role", content: "Illustrated the tennis-meets-motorsport visual language and developed the event identity across vehicle back walls, digital placements, and on-site activations. Worked closely with Cekai Studio to bring my storyboards to life across LED boards and jumbotrons throughout the grounds." },
      { id: "background", label: "Background", content: "Indian Wells is defined by light, color, and fun. The challenge was to translate BMW's precision and performance into a language that felt native to the environment." },
      { id: "platform", label: "Platform", content: "**Powered by Precision**\n\nRigorous dedication to craft.\nAn unending obsession with detail.\nExcellence achieved through a precise balance of elegance and power.\n\nIt's what defines BMW as the Ultimate Driving Machine, and what shapes the experience of Indian Wells." },
      { id: "solution", label: "Solution", content: "I developed a visual identity that brought energy and play to BMW's performance DNA, blending the dynamic curvature of driving with iconic tennis elements.\n\nThe system balanced athleticism and elegance through expressive motion, disciplined geometry, and a vibrant palette inspired by the light and energy of Indian Wells. It extended across animated LED boards, jumbotrons, vehicle display back walls, and digital placements, integrating BMW into the destination in a way that felt playful, refined, and unmistakably BMW." },
    ],
    className: "md:col-span-2",
  },
  {
    id: "7",
    slug: "zaxbys",
    title: "Zaxbys",
    description: "A system built for constant change.",
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
      { id: "role", label: "Role", content: "Designed a modular point-of-purchase system to support frequent menu updates across 950+ franchised Zaxbys locations, and art directed quarterly food and lifestyle shoots to build a scalable content library used across in-store and digital channels." },
      { id: "background", label: "Background", content: "Zaxbys menu changes constantly. Across 950+ franchised locations, this created inconsistent execution and a menu that was difficult to navigate at the point of order." },
      { id: "solution", label: "Solution", content: "Built a tightly defined POP system grounded in brand clarity and speed. Food was consistently photographed on cream or navy backgrounds and paired with standardized rules for pricing, typography, hierarchy, category color-coding, and promotional flags. The system was modular by design, allowing teams to update a single menu component at a time while keeping the rest of the board intact. The photography system extended beyond in-store to paid social, digital banners, email, and the app experience, ensuring cohesion across touchpoints." },
      { id: "impact", label: "Impact", content: "Improved menu clarity and brand consistency across 950+ locations while streamlining menu updates for internal teams, contributing to Zaxbys recognition as QSR's Transformational Brand of the Year in 2025." },
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
      type: "video",
      src: "/Work/MeritSystems/TerminalVideo.mp4",
      poster: "/Thumbnails/MeritSystems.png",
    },
    accentColor: "#7c3aed",
    logo: "/Work/MeritSystems/MeritIcon.png",
    logoClassName: "h-16 md:h-24 lg:h-32",
    role: "Brand Designer",
    context: "Identity design for a Web3 economics platform.",
    sections: [
      { id: "role", label: "Role", content: "Established brand identity for Merit Systems and worked closely with founders to translate novel technical vision into early web, product, and launch experiences." },
      { id: "background", label: "Background", content: "Merit Systems is an a16z-backed startup pioneering open-source economics. I partnered with the founders before the company had a name, funding, or product, helping shape how their vision for a new way of working would be understood, trusted, and shared." },
      { id: "challenge", label: "Challenge", content: "Because Merit's model didn't yet exist, there were no features to show or competitors to reference. For investors, contributors, and early hires to believe in it, the system itself needed to be visualized, not just described." },
      { id: "approach", label: "Approach", content: "I developed a Swiss-inspired identity rooted in grids, typographic clarity, and restraint to signal seriousness and long-term intent.\n\n\nUsing nodes, flows, and network diagrams, I translated abstract ideas around merit, agency, and ownership into clear visual systems.\n\nTo support social and digital presence, I also created a contemporary gradient system derived from the core palette to add depth and dynamism while preserving the brand's disciplined, systems-driven foundation." },
      { id: "impact", label: "Impact", content: "Closed a $10M seed round\n100K landing page views in the first week\n30K GitHub waitlist signups\n1K+ job applications\nCoverage in CNBC" },
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
    logoClassName: "h-16 md:h-24 lg:h-32",
    role: "Art Director",
    context: "Citywide advertising campaign for Advance SF during APEC.",
    sections: [
      { id: "role", label: "Role", content: "Art Direction for a citywide advertising campaign. Designed and modeled OOH placements, self-produced low-budget shoots, and collaborated with vendors to execute large-scale projections across San Francisco's most iconic landmarks." },
      { id: "background", label: "Background", content: "In the aftermath of the pandemic, San Francisco reached a critical inflection point. Amid economic strain, safety concerns, and heightened visibility of homelessness, national media narratives increasingly framed the city as a symbol of urban decline.\n\nAdvance SF came to us during this moment to help shift the narrative and tell a truer story about San Francisco." },
      { id: "insight", label: "Insight", content: "San Francisco has always been a place where the future takes shape first. Defined by ideas and invention, its identity as a crossroads of culture, fearlessness, and innovation hadn't disappeared. It had simply been overshadowed." },
      { id: "solution", label: "Solution", content: "We created It All Starts Here, a campaign rooted in San Francisco's enduring role as a birthplace of progress.\n\nInspired by the city's iconic street signs and intersections, the visual system emphasized the convergence of culture, commerce, and innovation through citywide OOH placements and landmark projections.\n\nEach execution paired two Bay Area–born companies, spanning many of the region's most influential brands, and balanced the campaign system with each company's distinct visual language and brand guidelines." },
      { id: "results", label: "Results", content: "Launched during APEC, the campaign sparked global attention and widespread press coverage, earning 2.1+ billion impressions across 445 media placements.\n\nPost-campaign research revealed a significant boost in local sentiment:\n\n90% associated San Francisco with innovation\n82% felt more hopeful about the city's future\n86% felt increased pride in San Francisco" },
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
