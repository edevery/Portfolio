"use client";

import { ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const router = useRouter();
  const transition = usePageTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Allow external onClick to prevent default behavior
      if (onClick) {
        onClick(e);
        if (e.defaultPrevented) return;
      }
      e.preventDefault();
      // Use transition if available, otherwise fall back to regular navigation
      if (transition?.navigateTo) {
        transition.navigateTo(href);
      } else {
        router.push(href);
      }
    },
    [href, transition, router, onClick]
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
