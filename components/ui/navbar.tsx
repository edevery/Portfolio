"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear pending state when navigation completes
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const links = navLinks.map((link) => ({
    ...link,
    icon: (
      <span className="text-[14px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">
        {link.title}
      </span>
    ),
    // Show as active if it's the current path OR if we're navigating to it
    isActive: pathname === link.href || pendingHref === link.href,
    isPending: pendingHref === link.href,
  }));

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
      <FloatingDock items={links} onNavigate={setPendingHref} />
    </div>
  );
}
