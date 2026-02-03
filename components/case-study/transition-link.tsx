"use client";

import { ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const router = useRouter();
  const transition = usePageTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Use transition if available, otherwise fall back to regular navigation
      if (transition?.navigateTo) {
        transition.navigateTo(href);
      } else {
        router.push(href);
      }
    },
    [href, transition, router]
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
