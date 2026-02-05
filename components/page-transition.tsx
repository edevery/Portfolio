"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  navigateTo: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  return context;
}

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = useCallback(
    (href: string) => {
      setIsTransitioning(true);

      // Wait for overlay to fully cover screen, then navigate
      setTimeout(() => {
        router.push(href);
        // Keep overlay visible while new page mounts, then reveal
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 550);
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {children}

      {/* Full-screen transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: 0.5,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
