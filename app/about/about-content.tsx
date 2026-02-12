"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import { MusicPlayer } from "@/components/music-player";

// Calculate rotation based on mouse position relative to element center
const calcRotation = (x: number, y: number, rect: DOMRect) => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rotateX = ((y - centerY) / (rect.height / 2)) * -15;
  const rotateY = ((x - centerX) / (rect.width / 2)) * 15;
  return [rotateX, rotateY];
};

// 3D Tilt Social Link Component
function TiltSocialLink({ link }: { link: { name: string; url: string; image: string } }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [springProps, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const [rotateX, rotateY] = calcRotation(e.clientX, e.clientY, rect);
    api.start({ rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    api.start({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <animated.a
      ref={ref}
      href={link.url}
      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
      rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="relative aspect-square overflow-hidden rounded-2xl"
      aria-label={link.name}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: springProps.rotateX.to(
          (rx) => `perspective(1000px) rotateX(${rx}deg) rotateY(${springProps.rotateY.get()}deg) scale(${springProps.scale.get()})`
        ),
      }}
    >
      <Image
        src={link.image}
        alt={link.name}
        fill
        className="object-cover"
      />
    </animated.a>
  );
}

// Photo list for carousel with locations
const photos = [
  { src: "/About/Photos/1-Rappel.png", location: "San Francisco, CA" },
  { src: "/About/Photos/2-Skiing2.png", location: "Maroon Bells, CO" },
  { src: "/About/Photos/3-ArtTech.png", location: "Mercer Labs, NY" },
  { src: "/About/Photos/4-NewYorkSkyLine.png", location: "Williamsburg, NY" },
  { src: "/About/Photos/5-Surfing.png", location: "Nayarit, Mexico" },
  { src: "/About/Photos/6-PatagoniaCamping.png", location: "Torres Del Paine, Chile" },
  { src: "/About/Photos/7-California.png", location: "Big Sur, CA" },
  { src: "/About/Photos/8-SF.png", location: "San Francisco, CA" },
  { src: "/About/Photos/9-SeaLion.png", location: "Baja, Mexico" },
  { src: "/About/Photos/10-BaliYoga.png", location: "Ubud, Bali" },
  { src: "/About/Photos/11-Westvillage.png", location: "New York, NY" },
  { src: "/About/Photos/12-SkyDiving.png", location: "Queenstown, NZ" },
  { src: "/About/Photos/13-Boulder.png", location: "Boulder, CO" },
  { src: "/About/Photos/14-GG.png", location: "San Francisco, CA" },
  { src: "/About/Photos/15-NorthernLights.png", location: "Staður, Iceland" },
  { src: "/About/Photos/16-PatagoniaHiking.png", location: "W Trek, Patagonia" },
  { src: "/About/Photos/17-Redwoods.png", location: "Santa Clara, CA" },
  { src: "/About/Photos/18-show.png", location: "Miami, FL" },
  { src: "/About/Photos/19-Skiing.png", location: "Highlands Bowl, CO" },
  { src: "/About/Photos/20-Guggenheim.png", location: "Bilbao, Spain" },
  { src: "/About/Photos/21-Iceland.png", location: "Ölfus, Iceland" },
  { src: "/About/Photos/22-NewYorkWinter.png", location: "New York, NY" },
  { src: "/About/Photos/23-London.png", location: "London, UK" },
];

// Social links
const socialLinks = [
  {
    name: "Twitter",
    url: "https://x.com/emdevvv",
    image: "/About/Logos/XLogo.png",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/emily-devery/",
    image: "/About/Logos/LinkedInIcon.png",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/edevery/",
    image: "/About/Logos/InstagramLogo.png",
  },
  {
    name: "Email",
    url: "mailto:emilybdevery@gmail.com",
    image: "/About/Logos/Gmail.png",
  },
];

export default function AboutContent() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextPhoto = useCallback(() => {
    setDirection(1);
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  }, []);

  const prevPhoto = useCallback(() => {
    setDirection(-1);
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, []);

  const resetAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextPhoto, 4000);
  }, [nextPhoto]);

  // Auto-rotate photos
  useEffect(() => {
    intervalRef.current = setInterval(nextPhoto, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextPhoto]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-black px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Section: Profile + Bio - using same 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
            <Image
              src="/About/Photos/ProfilePhoto.png"
              alt="Emily Devery"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Bio Container */}
          <div className="md:col-span-2 bg-zinc-900 rounded-3xl p-8 md:p-10">
            <div className="space-y-4 text-zinc-300 text-sm md:text-base leading-relaxed font-[family-name:var(--font-inter)]">
              <p>
                <span className="text-[#85c3ed] font-bold">Hi, I&apos;m Emily.</span> I care deeply about how things feel. How thoughtful design shapes meaning, trust, and experience. How brand systems quietly influence the way people relate to products and each other.
              </p>
              <p>
                I grew up in Boulder, studied design and marketing at USC, and spent a formative year at UAL, where I first saw how intentional design can make a brand feel alive. Living across LA, London, SF, and now NY has shaped how I see the world and design within it.
              </p>
              <p>
                I&apos;m most excited by the intersection of brand and emerging technology. Recently I designed and built an AI-powered relationship companion, exploring what it takes to give intelligent tools a voice, a point of view, and a new way to connect with the people we love most.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Photos, Music, Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photos Carousel */}
          <div className="relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden group">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPhotoIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <Image
                  src={photos[currentPhotoIndex].src}
                  alt={`Photo ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Photos Icon */}
            <div className="absolute top-3 right-3 w-[50px] h-[50px] z-10">
              <Image
                src="/About/Logos/PhotosIcon.png"
                alt="Photos"
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => { prevPhoto(); resetAutoAdvance(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              aria-label="Previous photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => { nextPhoto(); resetAutoAdvance(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              aria-label="Next photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>

          </div>

          {/* Music Player */}
          <MusicPlayer />

          {/* Social Links */}
          <div className="aspect-square bg-zinc-900 rounded-3xl p-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <TiltSocialLink key={link.name} link={link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
