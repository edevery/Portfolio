"use client";

import { FC, ReactNode } from "react";

/**
 * HomepageLayout - Responsive wrapper for homepage canvas components
 *
 * Text sizing: 80% of viewport width at all sizes
 * Note: Navigation is handled by the root layout's Navbar component
 */

interface HomepageLayoutProps {
  children: ReactNode;
}

const HomepageLayout: FC<HomepageLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden pt-[58px]">
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
    </div>
  );
};

export default HomepageLayout;
