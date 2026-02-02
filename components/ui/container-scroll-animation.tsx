"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface ContainerScrollProps {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function ContainerScroll({
  titleComponent,
  children,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleDimensions = useTransform(scrollYProgress, [0.1, 0.4], [1.05, 1]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.4], [25, 0]);
  const translate = useTransform(scrollYProgress, [0, 0.3], [-50, 0]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center relative -mt-16 md:-mt-24"
    >
      <div
        className="w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        {titleComponent && (
          <Header translate={translate}>{titleComponent}</Header>
        )}
        <Card rotate={rotate} scale={scaleDimensions}>
          {children}
        </Card>
      </div>
    </div>
  );
}

interface HeaderProps {
  translate: MotionValue<number>;
  children: React.ReactNode;
}

function Header({ translate, children }: HeaderProps) {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center mb-8"
    >
      {children}
    </motion.div>
  );
}

interface CardProps {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}

function Card({ rotate, scale, children }: CardProps) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="w-full rounded-3xl overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
