"use client";

import * as THREE from "three";
import { Suspense, useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import {
  Image,
  ScrollControls,
  useScroll,
  Billboard,
  Text,
  Line,
} from "@react-three/drei";
import { easing } from "maath";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Archive items organized by category
type ArchiveCategory = "identity" | "graphic" | "illustration" | "layout" | "art direction";

interface ArchiveItem {
  id: string;
  title: string;
  categories: ArchiveCategory[];
  image: string;
}

// Archive-specific items (older/additional projects not in main work section)
const archiveItems: ArchiveItem[] = [
  // Adidas Poster & Box (6 images) - graphic
  { id: "a1", title: "Adidas\nPoster & Box", categories: ["graphic"], image: "/archive/project-Adidas Poster & Box-1.png" },
  { id: "a2", title: "Adidas\nPoster & Box", categories: ["graphic"], image: "/archive/project-Adidas Poster & Box-2.png" },
  { id: "a3", title: "Adidas\nPoster & Box", categories: ["graphic"], image: "/archive/project-Adidas Poster & Box-3.png" },
  { id: "a4", title: "Adidas\nPoster & Box", categories: ["graphic"], image: "/archive/project-Adidas Poster & Box-4.png" },
  { id: "a5", title: "Adidas\nPoster & Box", categories: ["graphic"], image: "/archive/project-Adidas Poster & Box-5.png" },
  { id: "a6", title: "Adidas\nPoster & Box", categories: ["graphic"], image: "/archive/project-Adidas Poster & Box-6.png" },
  // Annie Chun's Noodles (3 images) - graphic
  { id: "a7", title: "Annie Chun's\nNoodles", categories: ["graphic"], image: "/archive/project-Annie Chun's Noodles-1.png" },
  { id: "a8", title: "Annie Chun's\nNoodles", categories: ["graphic"], image: "/archive/project-Annie Chun's Noodles-2.png" },
  { id: "a9", title: "Annie Chun's\nNoodles", categories: ["graphic"], image: "/archive/project-Annie Chun's Noodles-3.png" },
  // Eharmony: Sexual Harmony (8 images) - illustration, graphic
  { id: "a10", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-1.png" },
  { id: "a11", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-2.png" },
  { id: "a12", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-3.png" },
  { id: "a13", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-4.png" },
  { id: "a14", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-5.png" },
  { id: "a15", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-6.png" },
  { id: "a16", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-7.png" },
  { id: "a17", title: "Eharmony:\nSexual Harmony", categories: ["illustration", "graphic"], image: "/archive/project-Eharmony: Sexual Harmony-8.png" },
  // Grime Magazine (6 images) - layout
  { id: "a18", title: "Grime\nMagazine", categories: ["layout"], image: "/archive/project-Grime Magazine-1.png" },
  { id: "a19", title: "Grime\nMagazine", categories: ["layout"], image: "/archive/project-Grime Magazine-2.png" },
  { id: "a20", title: "Grime\nMagazine", categories: ["layout"], image: "/archive/project-Grime Magazine-3.png" },
  { id: "a21", title: "Grime\nMagazine", categories: ["layout"], image: "/archive/project-Grime Magazine-4.png" },
  { id: "a22", title: "Grime\nMagazine", categories: ["layout"], image: "/archive/project-Grime Magazine-5.png" },
  { id: "a23", title: "Grime\nMagazine", categories: ["layout"], image: "/archive/project-Grime Magazine-6.png" },
  // Jack Johnson Album Cover (2 images) - illustration, graphic
  { id: "a24", title: "Jack Johnson\nAlbum Cover", categories: ["illustration", "graphic"], image: "/archive/project-Jack Johnson Album Cover-1.png" },
  { id: "a25", title: "Jack Johnson\nAlbum Cover", categories: ["illustration", "graphic"], image: "/archive/project-Jack Johnson Album Cover-2.png" },
  // Lidl Christmas (5 images) - graphic
  { id: "a26", title: "Lidl\nChristmas", categories: ["graphic"], image: "/archive/project-Lidl Christmas-1.png" },
  { id: "a27", title: "Lidl\nChristmas", categories: ["graphic"], image: "/archive/project-Lidl Christmas-2.png" },
  { id: "a28", title: "Lidl\nChristmas", categories: ["graphic"], image: "/archive/project-Lidl Christmas-3.png" },
  { id: "a29", title: "Lidl\nChristmas", categories: ["graphic"], image: "/archive/project-Lidl Christmas-4.png" },
  { id: "a30", title: "Lidl\nChristmas", categories: ["graphic"], image: "/archive/project-Lidl Christmas-5.png" },
  // Motel 6 Concept (3 images) - identity
  { id: "a31", title: "Motel 6\nConcept", categories: ["identity"], image: "/archive/project-Motel 6 Concept-1.png" },
  { id: "a32", title: "Motel 6\nConcept", categories: ["identity"], image: "/archive/project-Motel 6 Concept-2.png" },
  { id: "a33", title: "Motel 6\nConcept", categories: ["identity"], image: "/archive/project-Motel 6 Concept-3.png" },
  // She Who Returns (1 image) - identity, graphic
  { id: "a34", title: "She Who\nReturns", categories: ["identity", "graphic"], image: "/archive/project-She Who Returns-1.png" },
  // Spanx Shapewear (3 images) - graphic
  { id: "a35", title: "Spanx\nShapewear", categories: ["graphic"], image: "/archive/project-Spanx Shapewear-1.png" },
  { id: "a36", title: "Spanx\nShapewear", categories: ["graphic"], image: "/archive/project-Spanx Shapewear-2.png" },
  { id: "a37", title: "Spanx\nShapewear", categories: ["graphic"], image: "/archive/project-Spanx Shapewear-3.png" },
  // Spanx White Pants (3 images) - art direction
  { id: "a38", title: "Spanx\nWhite Pants", categories: ["art direction"], image: "/archive/project-Spanx White Pants-1.png" },
  { id: "a39", title: "Spanx\nWhite Pants", categories: ["art direction"], image: "/archive/project-Spanx White Pants-2.png" },
  { id: "a40", title: "Spanx\nWhite Pants", categories: ["art direction"], image: "/archive/project-Spanx White Pants-3.png" },
];

// Helper to get thumbnail path from full image path
const getThumbnailPath = (imagePath: string) => {
  return imagePath.replace("/archive/", "/archive/thumbnails/");
};

// Aspect ratios
const CAROUSEL_ASPECT = 4 / 3; // 1.333 - slightly landscape for carousel cards
const FEATURED_ASPECT = 9 / 16; // 0.5625 - portrait for featured card

// Size multipliers
const CAROUSEL_SIZE = 0.7; // smaller cards in carousel
const FEATURED_SIZE = 6.5; // larger featured card for hero presence

export function ArchiveSection() {
  const isMobile = useIsMobile();
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(0);
  const [expandedItem, setExpandedItem] = useState<ArchiveItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close expanded view on Escape
      if (e.key === "Escape" && expandedItem) {
        setExpandedItem(null);
        return;
      }

      // Arrow navigation - works in both normal and expanded mode
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setKeyboardIndex((prev) => {
          const current = prev ?? 0;
          const newIndex = (current - 1 + archiveItems.length) % archiveItems.length;
          // If expanded, update the expanded item too
          if (expandedItem) {
            setExpandedItem(archiveItems[newIndex]);
          }
          return newIndex;
        });
        return;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setKeyboardIndex((prev) => {
          const current = prev ?? -1;
          const newIndex = (current + 1) % archiveItems.length;
          // If expanded, update the expanded item too
          if (expandedItem) {
            setExpandedItem(archiveItems[newIndex]);
          }
          return newIndex;
        });
        return;
      }

      // Don't handle Enter when expanded
      if (expandedItem) return;

      // Open expanded view on Enter when a card is selected
      if (e.key === "Enter" && keyboardIndex !== null) {
        e.preventDefault();
        setExpandedItem(archiveItems[keyboardIndex]);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedItem, keyboardIndex]);

  const handleExpand = useCallback((item: ArchiveItem) => {
    setExpandedItem(item);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setExpandedItem(null);
  }, []);

  return (
    <div className="w-full h-screen bg-black" tabIndex={0}>
      <Canvas dpr={[1, 1.5]} gl={{ alpha: false }} onCreated={({ gl }) => gl.setClearColor('#000000')}>
        <Suspense fallback={null}>
          <ScrollControls pages={4} infinite>
            <Scene
              position={[0, 0.5, 0]}
              keyboardIndex={keyboardIndex}
              setKeyboardIndex={setKeyboardIndex}
              onExpand={handleExpand}
              isMobile={isMobile}
            />
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Expanded view overlay */}
      {expandedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-pointer"
          onClick={handleCloseExpanded}
        >
          <div
            className="relative max-h-[calc(100vh-4rem)] flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={expandedItem.image}
              alt={expandedItem.title}
              className="max-h-[calc(100vh-4rem)] w-auto object-contain rounded-2xl"
            />
            {/* Close button with liquid glass effect - positioned on image corner */}
            <button
              onClick={handleCloseExpanded}
              className="absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
              aria-label="Close expanded view"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Controls legend - bottom right corner */}
      {!expandedItem && (
        <div className="fixed bottom-4 right-4 hidden md:flex flex-col items-end gap-1 text-white/50 text-[10px] font-mono group">
          <div className="flex items-center gap-1.5">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">navigate</span>
            <div className="flex gap-0.5">
              <span className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-sm leading-none">
                <AnimatedShinyText shimmerWidth={40}>←</AnimatedShinyText>
              </span>
              <span className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-sm leading-none">
                <AnimatedShinyText shimmerWidth={40}>→</AnimatedShinyText>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">expand</span>
            <span className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-sm leading-none">
              <AnimatedShinyText shimmerWidth={40}>↵</AnimatedShinyText>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">close</span>
            <span className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5">
              <AnimatedShinyText shimmerWidth={50}>esc</AnimatedShinyText>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">browse</span>
            <span className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5">
              <AnimatedShinyText shimmerWidth={60}>scroll</AnimatedShinyText>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Scene({
  keyboardIndex,
  setKeyboardIndex,
  onExpand,
  isMobile,
  ...props
}: {
  position?: [number, number, number];
  keyboardIndex: number | null;
  setKeyboardIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onExpand: (item: ArchiveItem) => void;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const prevOffset = useRef(0);
  const [hovered, setHovered] = useState<{ categories: ArchiveCategory[]; index: number; item: ArchiveItem } | null>(null);
  const [tapped, setTapped] = useState<{ categories: ArchiveCategory[]; index: number; item: ArchiveItem } | null>({
    categories: archiveItems[0].categories,
    index: 0,
    item: archiveItems[0],
  });

  // Determine what to show in the featured card
  // Mobile: only show on tap; Desktop: hover takes priority over keyboard
  const activeSelection = isMobile
    ? tapped
    : hovered ?? (keyboardIndex !== null ? {
        categories: archiveItems[keyboardIndex].categories,
        index: keyboardIndex,
        item: archiveItems[keyboardIndex],
      } : null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Accumulate rotation from frame-to-frame offset delta
    // This handles the infinite scroll wrap-around smoothly
    let d = scroll.offset - prevOffset.current;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    prevOffset.current = scroll.offset;
    ref.current.rotation.y -= d * (Math.PI * 2);
    state.events.update?.();
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  const handlePointerOver = useCallback((categories: ArchiveCategory[], index: number, item: ArchiveItem) => {
    setHovered({ categories, index, item });
    setKeyboardIndex(index);
  }, [setKeyboardIndex]);

  const handlePointerOut = useCallback(() => {
    setHovered(null);
  }, []);

  const handleTap = useCallback((categories: ArchiveCategory[], index: number, item: ArchiveItem) => {
    setTapped({ categories, index, item });
    setKeyboardIndex(index);
  }, [setKeyboardIndex]);

  return (
    <group ref={ref} {...props}>
      <Cards
        items={archiveItems}
        onPointerOver={isMobile ? undefined : handlePointerOver}
        onPointerOut={isMobile ? undefined : handlePointerOut}
        onTap={isMobile ? handleTap : undefined}
        keyboardIndex={keyboardIndex}
        isHovering={hovered !== null}
        isMobile={isMobile}
      />
      <ActiveCard hovered={activeSelection} onExpand={onExpand} isMobile={isMobile} />
    </group>
  );
}

function Cards({
  items,
  radius = 5.25,
  onPointerOver,
  onPointerOut,
  onTap,
  keyboardIndex,
  isHovering,
  isMobile,
}: {
  items: ArchiveItem[];
  radius?: number;
  onPointerOver?: (categories: ArchiveCategory[], index: number, item: ArchiveItem) => void;
  onPointerOut?: () => void;
  onTap?: (categories: ArchiveCategory[], index: number, item: ArchiveItem) => void;
  keyboardIndex: number | null;
  isHovering: boolean;
  isMobile: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const amount = items.length;

  return (
    <group>
      {items.map((item, i) => {
        // Distribute evenly around full circle
        const angle = (i / amount) * Math.PI * 2;
        const isKeyboardSelected = !isHovering && keyboardIndex === i;
        return (
          <Card
            key={item.id}
            onClick={isMobile ? (e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onTap?.(item.categories, i, item);
            } : undefined}
            onPointerOver={!isMobile ? (e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHoveredIndex(i);
              onPointerOver?.(item.categories, i, item);
            } : undefined}
            onPointerOut={!isMobile ? () => {
              setHoveredIndex(null);
              onPointerOut?.();
            } : undefined}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hoveredIndex !== null || keyboardIndex !== null}
            hovered={hoveredIndex === i}
            keyboardSelected={isKeyboardSelected}
            url={item.image}
          />
        );
      })}
    </group>
  );
}

function Card({
  url,
  active,
  hovered,
  keyboardSelected,
  ...props
}: {
  url: string;
  active: boolean;
  hovered: boolean;
  keyboardSelected: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const isHighlighted = hovered || keyboardSelected;

  useFrame((_, delta) => {
    if (!ref.current) return;
    const f = isHighlighted ? 1.4 : active ? 1.25 : 1;
    easing.damp3(ref.current.position, [0, isHighlighted ? 0.25 : 0, 0], 0.1, delta);
    easing.damp3(ref.current.scale, [CAROUSEL_ASPECT * CAROUSEL_SIZE * f, CAROUSEL_SIZE * f, 1], 0.15, delta);
  });

  return (
    <group {...props}>
      <group ref={ref}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          transparent
          radius={0.075}
          url={getThumbnailPath(url)}
          rotation={[0, 0, Math.PI / 2]}
          scale={[CAROUSEL_ASPECT * CAROUSEL_SIZE, CAROUSEL_SIZE, 1] as unknown as number}
          side={THREE.DoubleSide}
        />
      </group>
    </group>
  );
}

function ActiveCard({
  hovered,
  onExpand,
  isMobile,
  ...props
}: {
  hovered: { categories: ArchiveCategory[]; index: number; item: ArchiveItem } | null;
  onExpand: (item: ArchiveItem) => void;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  // Mobile uses smaller featured card
  const size = isMobile ? 4.5 : FEATURED_SIZE;

  useLayoutEffect(() => {
    if (ref.current) {
      // Reset zoom on hover change
      ref.current.scale.set(0.8, 0.8, 0.8);
    }
  }, [hovered]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Animate scale as zoom effect
    const targetScale = 1;
    easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.5, delta);
    // Animate opacity via visibility
    const targetOpacity = hovered !== null ? 1 : 0;
    ref.current.visible = targetOpacity > 0.01 || hovered !== null;
  });

  const handleExpandClick = useCallback(() => {
    if (hovered) {
      onExpand(hovered.item);
    }
  }, [hovered, onExpand]);

  return (
    <Billboard {...props}>
      <group ref={ref}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          transparent
          radius={0.3}
          position={[0, isMobile ? 1.8 : 1.5, 0]}
          scale={[size * FEATURED_ASPECT, size, 1] as unknown as number}
          url={hovered ? getThumbnailPath(hovered.item.image) : "/Thumbnails/Desktop/Vesta.png"}
        />
        {hovered && (
          <>
            {isMobile ? (
              <>
                {/* Mobile: Title centered below the image */}
                <Text
                  position={[0, 1.8 - size / 2 - 0.4, 0]}
                  fontSize={0.35}
                  fontWeight={700}
                  color="white"
                  anchorX="center"
                  anchorY="top"
                  maxWidth={4}
                  lineHeight={1.1}
                  textAlign="center"
                >
                  {hovered.item.title}
                </Text>
              </>
            ) : (
              <>
                {/* Desktop: Title at top right of featured card */}
                <Text
                  position={[size * FEATURED_ASPECT / 2 + 0.6, 1.5 + size / 2 - 0.5, 0]}
                  fontSize={0.5}
                  fontWeight={700}
                  color="white"
                  anchorX="left"
                  anchorY="top"
                  maxWidth={6}
                  lineHeight={1.1}
                >
                  {hovered.item.title}
                </Text>
                {/* Desktop: Category tags below the title */}
                <CategoryPills
                  categories={hovered.categories}
                  position={[size * FEATURED_ASPECT / 2 + 0.6, 1.5 + size / 2 - 2.1, 0]}
                />
              </>
            )}
            {/* Expand button - diagonal arrow at bottom right of featured card with liquid glass effect */}
            <group
              position={[size * FEATURED_ASPECT / 2 - 0.35, (isMobile ? 1.8 : 1.5) - size / 2 + 0.35, 0.1]}
              onClick={handleExpandClick}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
              {/* Drop shadow behind button */}
              <mesh position={[0, 0, -0.01]}>
                <circleGeometry args={[0.22, 32]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.5} />
              </mesh>
              {/* Button background circle - liquid glass effect */}
              <mesh>
                <circleGeometry args={[0.22, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
              </mesh>
              {/* Button border ring */}
              <Line
                points={Array.from({ length: 33 }, (_, i) => {
                  const angle = (i / 32) * Math.PI * 2;
                  return [Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0.01] as [number, number, number];
                })}
                color="#ffffff"
                lineWidth={1}
                transparent
                opacity={0.3}
              />
              {/* Diagonal arrow using lines - white for glass effect */}
              <Line
                points={[
                  [-0.07, -0.07, 0.02],
                  [0.07, 0.07, 0.02],
                ]}
                color="white"
                lineWidth={2}
              />
              <Line
                points={[
                  [0.07, 0.07, 0.02],
                  [-0.01, 0.07, 0.02],
                ]}
                color="white"
                lineWidth={2}
              />
              <Line
                points={[
                  [0.07, 0.07, 0.02],
                  [0.07, -0.01, 0.02],
                ]}
                color="white"
                lineWidth={2}
              />
            </group>
          </>
        )}
      </group>
    </Billboard>
  );
}

// Helper to calculate total width of all pills (for centering on mobile)
function getTotalPillsWidth(categories: ArchiveCategory[]): number {
  const gap = 0.15;
  return categories.reduce((total, cat, i) => {
    const width = cat.toUpperCase().length * 0.11 + 0.4;
    return total + width + (i < categories.length - 1 ? gap : 0);
  }, 0);
}

// Helper to create pill outline points
function createPillPoints(width: number, height: number, segments = 16): [number, number, number][] {
  const points: [number, number, number][] = [];
  const radius = height / 2;

  // Right semicircle (top to bottom)
  for (let i = 0; i <= segments; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / segments;
    points.push([
      width / 2 - radius + Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ]);
  }

  // Left semicircle (bottom to top)
  for (let i = 0; i <= segments; i++) {
    const angle = Math.PI / 2 + (Math.PI * i) / segments;
    points.push([
      -width / 2 + radius + Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ]);
  }

  // Close the shape
  points.push(points[0]);

  return points;
}

function CategoryPills({
  categories,
  position,
}: {
  categories: ArchiveCategory[];
  position: [number, number, number];
}) {
  const pillHeight = 0.32;
  const gap = 0.15;

  // Calculate widths for each pill
  const pillData = categories.map((cat) => {
    const text = cat.toUpperCase();
    const width = text.length * 0.11 + 0.4;
    return { text, width };
  });

  // Calculate x positions for each pill using reduce to avoid mutation
  const pillsWithPositions = pillData.reduce<Array<{ text: string; width: number; x: number }>>((acc, pill, index) => {
    const x = index === 0 ? 0 : acc[index - 1].x + acc[index - 1].width + gap;
    acc.push({ ...pill, x });
    return acc;
  }, []);

  return (
    <group position={position}>
      {pillsWithPositions.map((pill, i) => {
        const pillPoints = createPillPoints(pill.width, pillHeight);
        return (
          <group key={i} position={[pill.x, 0, 0]}>
            {/* Pill outline */}
            <Line
              points={pillPoints}
              color="white"
              lineWidth={1}
              position={[pill.width / 2, 0, 0]}
            />
            {/* Category text */}
            <Text
              position={[pill.width / 2, 0, 0]}
              fontSize={0.16}
              fontWeight={500}
              color="white"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.05}
            >
              {pill.text}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
