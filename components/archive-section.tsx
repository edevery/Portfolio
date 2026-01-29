"use client";

import * as THREE from "three";
import { Suspense, useLayoutEffect, useRef, useState, useCallback } from "react";
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

// Aspect ratios
const CAROUSEL_ASPECT = 4 / 3; // 1.333 - slightly landscape for carousel cards
const FEATURED_ASPECT = 9 / 16; // 0.5625 - portrait for featured card

// Size multipliers
const CAROUSEL_SIZE = 0.7; // smaller cards in carousel
const FEATURED_SIZE = 5.5; // larger featured card for hero presence

export function ArchiveSection() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: false }} onCreated={({ gl }) => gl.setClearColor('#000000')}>
        <Suspense fallback={null}>
          <ScrollControls pages={4} infinite>
            <Scene position={[0, 1.5, 0]} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({
  ...props
}: {
  position?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const [hovered, setHovered] = useState<{ categories: ArchiveCategory[]; index: number; item: ArchiveItem } | null>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
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
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(null);
  }, []);

  return (
    <group ref={ref} {...props}>
      <Cards
        items={archiveItems}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      <ActiveCard hovered={hovered} />
    </group>
  );
}

function Cards({
  items,
  radius = 5.25,
  onPointerOver,
  onPointerOut,
}: {
  items: ArchiveItem[];
  radius?: number;
  onPointerOver: (categories: ArchiveCategory[], index: number, item: ArchiveItem) => void;
  onPointerOut: () => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const amount = items.length;

  return (
    <group>
      {items.map((item, i) => {
        // Distribute evenly around full circle
        const angle = (i / amount) * Math.PI * 2;
        return (
          <Card
            key={item.id}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHoveredIndex(i);
              onPointerOver(item.categories, i, item);
            }}
            onPointerOut={() => {
              setHoveredIndex(null);
              onPointerOut();
            }}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hoveredIndex !== null}
            hovered={hoveredIndex === i}
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
  ...props
}: {
  url: string;
  active: boolean;
  hovered: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: () => void;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const f = hovered ? 1.4 : active ? 1.25 : 1;
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta);
    easing.damp3(ref.current.scale, [CAROUSEL_ASPECT * CAROUSEL_SIZE * f, CAROUSEL_SIZE * f, 1], 0.15, delta);
  });

  return (
    <group {...props}>
      <group ref={ref}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          transparent
          radius={0.075}
          url={url}
          scale={[CAROUSEL_ASPECT * CAROUSEL_SIZE, CAROUSEL_SIZE, 1] as unknown as number}
          side={THREE.DoubleSide}
        />
      </group>
    </group>
  );
}

function ActiveCard({
  hovered,
  ...props
}: {
  hovered: { categories: ArchiveCategory[]; index: number; item: ArchiveItem } | null;
}) {
  const ref = useRef<THREE.Group>(null);

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

  return (
    <Billboard {...props}>
      <group ref={ref}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          transparent
          radius={0.3}
          position={[0, 1.5, 0]}
          scale={[FEATURED_SIZE * FEATURED_ASPECT, FEATURED_SIZE, 1] as unknown as number}
          url={hovered?.item.image ?? "/Thumbnails/Vesta.png"}
        />
        {hovered && (
          <>
            {/* Title - positioned at top right of featured card */}
            <Text
              position={[FEATURED_SIZE * FEATURED_ASPECT / 2 + 0.6, 1.5 + FEATURED_SIZE / 2 - 0.5, 0]}
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
            {/* Category tags - below the title with pill outlines */}
            <CategoryPills
              categories={hovered.categories}
              position={[FEATURED_SIZE * FEATURED_ASPECT / 2 + 0.6, 1.5 + FEATURED_SIZE / 2 - 2.1, 0]}
            />
          </>
        )}
      </group>
    </Billboard>
  );
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

  // Calculate x positions for each pill
  let currentX = 0;
  const pillsWithPositions = pillData.map((pill) => {
    const x = currentX;
    currentX += pill.width + gap;
    return { ...pill, x };
  });

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
