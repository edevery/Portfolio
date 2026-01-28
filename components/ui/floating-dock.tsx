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
}: {
  items: { title: string; icon: React.ReactNode; href: string; isActive?: boolean }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string; isActive?: boolean }[];
  className?: string;
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
                  className={cn(
                    "flex h-6 items-center justify-center rounded-full px-5 transition-colors duration-300",
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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string; isActive?: boolean }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e: React.MouseEvent) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-auto items-center gap-1 rounded-full bg-gray-50 px-2 py-1.5 md:flex dark:bg-neutral-900",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  icon,
  href,
  isActive,
}: {
  mouseX: MotionValue<number>;
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const heightSync = useTransform(distance, [-150, 0, 150], [26, 38, 26]);
  const paddingSync = useTransform(distance, [-150, 0, 150], [12, 24, 12]);
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.3, 1]);

  const springConfig = { mass: 0.15, stiffness: 120, damping: 14 };
  const height = useSpring(heightSync, springConfig);
  const paddingX = useSpring(paddingSync, springConfig);
  const scale = useSpring(scaleSync, springConfig);

  return (
    <Link href={href} className="group">
      <motion.div
        ref={ref}
        style={{ height, paddingLeft: paddingX, paddingRight: paddingX }}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-300",
          isActive ? "bg-white" : "bg-neutral-800 hover:ring-1 hover:ring-white"
        )}
      >
        <motion.div
          style={{ scale }}
          className={cn(
            "flex items-center justify-center transition-colors duration-300",
            isActive ? "text-neutral-900" : "text-white/90"
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}
