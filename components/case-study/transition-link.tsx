"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useCallback, useEffect } from "react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsTransitioning(true);

      // Navigate after the exit animation
      setTimeout(() => {
        router.push(href);
      }, 400);
    },
    [href, router]
  );

  // Subtle scale-down on current page
  useEffect(() => {
    if (isTransitioning) {
      const main = document.querySelector("body > div") as HTMLElement;
      if (main) {
        main.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0, 1), opacity 0.4s cubic-bezier(0.4, 0, 0, 1)";
        main.style.transform = "scale(0.97)";
        main.style.opacity = "0";
      }
    }
  }, [isTransitioning]);

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
