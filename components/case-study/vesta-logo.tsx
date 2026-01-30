"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function VestaLogo({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      }}
      whileHover={{
        scale: 1.02,
        filter: "drop-shadow(0 0 20px rgba(254, 159, 40, 0.4))",
        transition: { duration: 0.3 },
      }}
      style={{ aspectRatio: "469.28 / 147.05" }}
    >
      <Image
        src="/Work/Vesta/VestaLogoGradient.png"
        alt="Vesta"
        fill
        className="object-contain"
        priority
      />
    </motion.div>
  );
}
