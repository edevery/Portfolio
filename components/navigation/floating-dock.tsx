"use client";

/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  onNavigate,
}: {
  items: { title: string; icon: React.ReactNode; href: string; isActive?: boolean; isPending?: boolean }[];
  desktopClassName?: string;
  mobileClassName?: string;
  onNavigate?: (href: string) => void;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} onNavigate={onNavigate} />
      <FloatingDockMobile items={items} className={mobileClassName} onNavigate={onNavigate} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  onNavigate,
}: {
  items: { title: string; icon: React.ReactNode; href: string; isActive?: boolean; isPending?: boolean }[];
  className?: string;
  onNavigate?: (href: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link
                  href={item.href}
                  key={item.title}
                  onClick={() => onNavigate?.(item.href)}
                  className={cn(
                    "flex h-12 items-center justify-center rounded-full px-10 transition-colors duration-300 backdrop-blur-xl border border-white/20",
                    item.isActive ? "bg-white/90 text-[#171717]" : "bg-white/10 text-white/90"
                  )}
                >
                  <div>{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
      >
        <IconLayoutNavbarCollapse className="h-10 w-10 text-white/70" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onNavigate,
}: {
  items: { title: string; icon: React.ReactNode; href: string; isActive?: boolean; isPending?: boolean }[];
  className?: string;
  onNavigate?: (href: string) => void;
}) => {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  // Determine which item should have the pill (hovered takes priority, then active)
  const activeHref = items.find((item) => item.isActive)?.href;
  const highlightedHref = hoveredHref ?? activeHref;

  return (
    <div
      className={cn(
        "mx-auto hidden h-auto items-center rounded-full p-1.5 md:flex",
        "bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5",
        className,
      )}
      onMouseLeave={() => setHoveredHref(null)}
      data-cursor="nav"
    >
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          onClick={() => onNavigate?.(item.href)}
          onMouseEnter={() => setHoveredHref(item.href)}
          className="relative flex h-12 items-center justify-center px-7"
        >
          {/* Sliding pill background */}
          {highlightedHref === item.href && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-full"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
          )}
          <span
            className={cn(
              "relative z-10 text-[14px] transition-all duration-200 font-[family-name:var(--font-inter)] tracking-wider",
              highlightedHref === item.href ? "text-neutral-900 font-semibold" : "text-white/90 font-medium"
            )}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
};
