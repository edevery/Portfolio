"use client";

import { FC, ReactNode } from "react";
import { FloatingDock } from "@/components/navigation/floating-dock";

/**
 * HomepageLayout - Responsive wrapper for homepage canvas components
 *
 * Text sizing: 80% of viewport width at all sizes
 */

const navLinks = [
  {
    title: "Home",
    icon: (
      <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        Home
      </span>
    ),
    href: "/",
  },
  {
    title: "Work",
    icon: (
      <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        Work
      </span>
    ),
    href: "/work",
  },
  {
    title: "Archive",
    icon: (
      <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        Archive
      </span>
    ),
    href: "/archive",
  },
  {
    title: "Play",
    icon: (
      <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        Play
      </span>
    ),
    href: "/play",
  },
  {
    title: "About",
    icon: (
      <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        About
      </span>
    ),
    href: "/about",
  },
];

interface HomepageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

const HomepageLayout: FC<HomepageLayoutProps> = ({
  children,
  showNav = true,
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/*
        Canvas container with responsive sizing

        Width calculation: max(40vw, min(85vw, 2025px - 27.5vw))
        - Adds 15% buffer on each side for effect overflow (blur/glow)
        - Total canvas = textWidth * 1.18 (roughly)

        Height: maintains 16:9 aspect ratio based on width
      */}
      <div
        className="relative"
        style={{
          width: "80vw",
          aspectRatio: "16 / 9",
        }}
      >
        {children}
      </div>

      {showNav && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
          <FloatingDock items={navLinks} />
        </div>
      )}

    </div>
  );
};

export default HomepageLayout;
