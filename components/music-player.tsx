"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";

interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

const tracks: Track[] = [
  {
    title: "Waste (RY X Remix)",
    artist: "Rhye",
    src: "/About/Music/Rhye/Blood Remixed/01 Waste (RY X Remix).m4a",
    cover: "/About/Music/Covers/Waste(RYXREMIX)_Rhye.jpg",
  },
  {
    title: "Who I Am",
    artist: "Saje",
    src: "/About/Music/Saje/Take Care Of You/02 Who I Am.mp3",
    cover: "/About/Music/Covers/WhoIAM_Saje.jpeg",
  },
  {
    title: "Lost",
    artist: "Maxomar",
    src: "/About/Music/Maxomar/Lost - Single/01 Lost.m4a",
    cover: "/About/Music/Covers/Lost_Maxomar.jpg",
  },
  {
    title: "Difficult to Love",
    artist: "Elderbrook",
    src: "/About/Music/Elderbrook/Difficult to Love - Single/01 Difficult to Love.m4a",
    cover: "/About/Music/Covers/DifficulttoLove_Elderbrook.jpeg",
  },
  {
    title: "Nobody Else",
    artist: "Snacks",
    src: "/About/Music/Snacks/Nobody Else EP - EP/01 Nobody Else.m4a",
    cover: "/About/Music/Covers/NobodyElse_Snacks.jpg",
  },
];

// Calculate rotation based on mouse position relative to element center
const calcRotation = (x: number, y: number, rect: DOMRect) => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rotateX = ((y - centerY) / (rect.height / 2)) * -15;
  const rotateY = ((x - centerX) / (rect.width / 2)) * 15;
  return [rotateX, rotateY];
};

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const spotifyRef = useRef<HTMLAnchorElement>(null);

  const [springProps, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!spotifyRef.current) return;
    const rect = spotifyRef.current.getBoundingClientRect();
    const [rotateX, rotateY] = calcRotation(e.clientX, e.clientY, rect);
    api.start({ rotateX, rotateY, scale: 1.15 });
  };

  const handleMouseLeave = () => {
    api.start({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div className="relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden group">
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      {/* Full Album Art Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTrackIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={currentTrack.cover}
            alt={`${currentTrack.title} by ${currentTrack.artist}`}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Spotify Icon - Top Right with 3D tilt */}
      <animated.a
        ref={spotifyRef}
        href="https://open.spotify.com/playlist/0a76BEZHf6wCPYr90Lnyoe?si=q5TnEmm7Qju20bXrrf73KQ"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 w-12 h-12 z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: springProps.rotateX.to(
            (rx) => `perspective(1000px) rotateX(${rx}deg) rotateY(${springProps.rotateY.get()}deg) scale(${springProps.scale.get()})`
          ),
        }}
      >
        <Image
          src="/About/Logos/SpotifyIcon.png"
          alt="Open in Spotify"
          fill
          className="object-contain"
        />
      </animated.a>

      {/* Navigation Controls - Liquid Glass (center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg pointer-events-auto">
          {/* Previous */}
          <button
            onClick={prevTrack}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-[#85c3ed] transition-colors"
            aria-label="Previous track"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-[#85c3ed] transition-colors"
            aria-label="Next track"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
