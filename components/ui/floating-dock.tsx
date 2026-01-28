"use client";

/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useRef, useState } from "react";

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
                    "flex h-8 items-center justify-center rounded-full px-7 transition-colors duration-300",
                    item.isActive ? "bg-white text-neutral-900" : "bg-neutral-800 text-white/90"
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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-7 w-7 text-neutral-500 dark:text-neutral-400" />
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
  const mouseX = useMotionValue(Infinity);

  return (
    <>
      <GooeyFilter />
      <motion.div
        onMouseMove={(e: React.MouseEvent) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "mx-auto hidden h-auto items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2 md:flex dark:bg-neutral-900",
          className,
        )}
      >
        {items.map((item) => (
          <IconContainer mouseX={mouseX} key={item.title} {...item} onNavigate={onNavigate} />
        ))}
      </motion.div>
    </>
  );
};

// SVG filter for gooey effect - renders once, used by all icons
const GooeyFilter = () => (
  <svg className="absolute w-0 h-0" aria-hidden="true">
    <defs>
      <filter id="gooey-nav">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
);

function IconContainer({
  mouseX,
  icon,
  href,
  isActive,
  onNavigate,
}: {
  mouseX: MotionValue<number>;
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
  isPending?: boolean;
  onNavigate?: (href: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [entryX, setEntryX] = useState(0); // 0-100, where mouse entered

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const heightSync = useTransform(distance, [-210, 0, 210], [36, 53, 36]);
  const paddingSync = useTransform(distance, [-210, 0, 210], [17, 34, 17]);
  const scaleSync = useTransform(distance, [-210, 0, 210], [1, 1.3, 1]);

  const springConfig = { mass: 0.15, stiffness: 120, damping: 14 };
  const height = useSpring(heightSync, springConfig);
  const paddingX = useSpring(paddingSync, springConfig);
  const scale = useSpring(scaleSync, springConfig);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isActive) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (bounds) {
      // Calculate where mouse entered as percentage (0-100)
      const relativeX = e.clientX - bounds.x;
      const percentage = Math.max(0, Math.min(100, (relativeX / bounds.width) * 100));
      setEntryX(percentage);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link href={href} className="group" onClick={() => onNavigate?.(href)}>
      <motion.div
        ref={ref}
        style={{ height, paddingLeft: paddingX, paddingRight: paddingX }}
        className={cn(
          "relative flex items-center justify-center rounded-full overflow-hidden",
          isActive ? "bg-white" : "bg-neutral-800"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gooey fill that expands from mouse entry point */}
        {!isActive && (
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            style={{ filter: "url(#gooey-nav)" }}
            initial={false}
            animate={{
              clipPath: isHovered
                ? `circle(150% at ${entryX}% 50%)`
                : `circle(0% at ${entryX}% 50%)`,
            }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1], // Custom ease for organic feel
            }}
          />
        )}
        <motion.div
          style={{ scale }}
          className={cn(
            "relative z-10 flex items-center justify-center",
            isActive
              ? "text-neutral-900"
              : "text-white/90"
          )}
        >
          <motion.span
            animate={{
              color: isHovered && !isActive ? "#171717" : isActive ? "#171717" : "rgba(255,255,255,0.9)",
            }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
          >
            {icon}
          </motion.span>
        </motion.div>
      </motion.div>
    </Link>
  );
}
