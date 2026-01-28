"use client";

import { usePathname } from "next/navigation";
import { FloatingDock } from "./floating-dock";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Work", href: "/work" },
  { title: "Archive", href: "/archive" },
  { title: "Play", href: "/play" },
  { title: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();

  const links = navLinks.map((link) => ({
    ...link,
    icon: (
      <span className="text-[14px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        {link.title}
      </span>
    ),
    isActive: pathname === link.href,
  }));

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
      <FloatingDock items={links} />
    </div>
  );
}
