"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FOLDER_RAMP, INCASE_SURFACE } from "./incase-tokens";
import { IncaseCalloutPill } from "./incase-case-panel";

/**
 * §3.7 right — the folder stack, scroll driven.
 * Folders 2–9 rise 56px and fade in sequentially as the panel moves up the
 * viewport; folder 1 is always settled.
 */

const SLANT = 9;
const GAP = 27;
const TOP_W = 37;
const X0 = 42;
const N = 8;
const RISE = 56;

const FRONT_RX = X0 + GAP;

const frontPath = `M5 32 Q5 22 15 22 L${FRONT_RX - 5} 22 Q${FRONT_RX} 22 ${(
  FRONT_RX + 2.6
).toFixed(1)} 26.3 L${FRONT_RX + SLANT} 37 L265 37 Q275 37 275 47 L275 200 Q275 210 263 210 L17 210 Q5 210 5 200 Z`;

const creamPath =
  "M5 56 L263 56 Q275 56 275 67 L275 200 Q275 210 263 210 L17 210 Q5 210 5 200 Z";

function behindPath(tabX: number) {
  const tl = tabX + SLANT;
  const tr = tabX + SLANT + TOP_W;
  return `M5 47 Q5 37 15 37 L${tabX} 37 L${(tl - 2.6).toFixed(1)} 26.3 Q${tl} 22 ${
    tl + 5
  } 22 L${tr - 5} 22 Q${tr} 22 ${(tr + 2.6).toFixed(1)} 26.3 L${
    tabX + 2 * SLANT + TOP_W
  } 37 L265 37 Q275 37 275 47 L275 200 Q275 210 263 210 L17 210 Q5 210 5 200 Z`;
}

function lastPath(tabX: number) {
  const tl = tabX + SLANT;
  return `M5 47 Q5 37 15 37 L${tabX} 37 L${(tl - 2.6).toFixed(1)} 26.3 Q${tl} 22 ${
    tl + 5
  } 22 L265 22 Q275 22 275 32 L275 200 Q275 210 263 210 L17 210 Q5 210 5 200 Z`;
}

const STACK = Array.from({ length: 9 }, (_, idx) => {
  const k = idx + 1;
  const tabX = X0 + (k - 2) * GAP;
  return {
    k,
    d: k === 1 ? frontPath : k === 9 ? lastPath(tabX) : behindPath(tabX),
    col: FOLDER_RAMP[k - 1],
  };
});

const THUMB_H = 40;

export function IncaseFolderStack() {
  const panelRef = useRef<HTMLDivElement>(null);
  // Two paths per folder (tab shape + cream body) move together.
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // Whichever input was used last drives the stack: page scroll by default,
  // the scrubber once it's grabbed, and back to scroll on the next page scroll.
  const modeRef = useRef<"scroll" | "manual">("scroll");
  const draggingRef = useRef(false);
  // Where inside the thumb the pointer grabbed it, so the thumb follows the
  // cursor from that point rather than jumping its centre under it.
  const grabOffsetRef = useRef(THUMB_H / 2);
  const releaseRef = useRef<(() => void) | null>(null);
  const [dragging, setDragging] = useState(false);

  const applyProgress = useCallback((p: number) => {
    groupRefs.current.forEach((g, idx) => {
      if (!g) return;
      const k = idx + 1;
      if (k === 1) {
        g.setAttribute("transform", "translate(0, 0)");
        g.style.opacity = "1";
        return;
      }
      const start = ((k - 2) / N) * 0.9;
      const dur = (1 / N) * 1.6;
      const sp = Math.min(1, Math.max(0, (p - start) / dur));
      const e = 1 - Math.pow(1 - sp, 3);
      g.setAttribute("transform", `translate(0, ${((1 - e) * RISE).toFixed(2)})`);
      g.style.opacity = sp > 0.02 ? "1" : "0";
    });

    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (track && thumb) {
      const travel = Math.max(0, track.clientHeight - THUMB_H);
      thumb.style.transform = `translateY(${(p * travel).toFixed(2)}px)`;
      thumb.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    }
  }, []);

  /** Progress from the panel's position in the viewport (handoff §3.7). */
  const scrollProgress = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return 0;
    const r = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    const span = r.height + vh * 0.75;
    return Math.min(1, Math.max(0, (vh - r.top - vh * 0.2) / span));
  }, []);

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      if (modeRef.current === "scroll") applyProgress(scrollProgress());
    };
    const onScroll = () => {
      if (draggingRef.current) return;
      modeRef.current = "scroll"; // page scroll reclaims control
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame = requestAnimationFrame(apply);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [applyProgress, scrollProgress]);

  const progressFromPointer = useCallback((clientY: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - THUMB_H);
    return Math.min(
      1,
      Math.max(0, (clientY - r.top - grabOffsetRef.current) / travel)
    );
  }, []);

  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();

    // Grabbing the thumb keeps the offset under the cursor; clicking the bare
    // track centres the thumb on the click and drags from there.
    const thumb = thumbRef.current;
    if (thumb) {
      const tr = thumb.getBoundingClientRect();
      const onThumb = e.clientY >= tr.top && e.clientY <= tr.bottom;
      grabOffsetRef.current = onThumb ? e.clientY - tr.top : THUMB_H / 2;
    }

    draggingRef.current = true;
    setDragging(true);
    modeRef.current = "manual";
    applyProgress(progressFromPointer(e.clientY));

    // Bind to the window, and bind it here rather than from an effect keyed on
    // `dragging`: the track is only ~24px wide, so the cursor leaves it almost
    // immediately, and waiting for a React commit would miss the opening moves.
    const onMove = (ev: PointerEvent) => {
      if (!draggingRef.current) return;
      ev.preventDefault();
      applyProgress(progressFromPointer(ev.clientY));
    };
    const onEnd = () => {
      draggingRef.current = false;
      setDragging(false);
      releaseRef.current?.();
      releaseRef.current = null;
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    const prevSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none"; // don't select copy while dragging

    releaseRef.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      document.body.style.userSelect = prevSelect;
    };
  };

  // Drop any in-flight drag listeners if the panel unmounts mid-drag.
  useEffect(() => () => releaseRef.current?.(), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.2 : 0.05;
    const current = Number(thumbRef.current?.getAttribute("aria-valuenow") ?? 0) / 100;
    let next = current;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = current + step;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = current - step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    else return;
    e.preventDefault();
    modeRef.current = "manual";
    applyProgress(Math.min(1, Math.max(0, next)));
  };

  return (
    <div
      ref={panelRef}
      className="relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl p-8 md:p-14"
      style={{ background: INCASE_SURFACE.coolPlate, minHeight: 560 }}
    >
      <IncaseCalloutPill label="SCROLL" color="#005679" />

      {/* Scrubber — drag to drive the stack without scrolling the page. The
          wrapper is wider than the visible rail to give the thumb a real
          hit area; `touch-none` keeps a drag from scrolling the page. */}
      <div
        ref={trackRef}
        onPointerDown={startDrag}
        className={`absolute right-3 md:right-5 top-1/2 z-30 h-40 md:h-48 w-6 -translate-y-1/2 touch-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div
          className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 rounded-full"
          style={{ background: "rgba(23,36,43,.14)" }}
        />
        <div
          ref={thumbRef}
          role="slider"
          tabIndex={0}
          aria-label="Scrub the folder stack animation"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="absolute left-1/2 top-0 w-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#005679]/50"
          style={{
            height: THUMB_H,
            marginLeft: -3,
            background: "#005679",
            opacity: dragging ? 1 : 0.75,
            // Transform is written directly on every frame — never transition it,
            // or the thumb lags behind the cursor.
            transition: "opacity .2s ease",
            willChange: "transform",
          }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-[80%] md:w-[60%]">
          {/* Ground shadow */}
          <div
            className="absolute"
            style={{
              left: "50%",
              bottom: "4%",
              transform: "translateX(-50%)",
              width: "78%",
              height: 26,
              background: "rgba(23,36,43,.18)",
              filter: "blur(15px)",
              borderRadius: "50%",
            }}
          />
          <svg
            viewBox="0 12 280 206"
            width="100%"
            className="relative block"
            style={{ overflow: "visible" }}
            aria-label="Nine Incase folders stacking as you scroll or drag the scrubber"
            role="img"
          >
            {STACK.map((f, idx) => (
              <g
                key={f.k}
                ref={(el) => {
                  groupRefs.current[idx] = el;
                }}
                style={{ opacity: 0 }}
              >
                <path
                  d={f.d}
                  fill={f.col}
                  stroke="#17242B"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
                <path
                  d={creamPath}
                  fill="#F4EDE1"
                  stroke="#17242B"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
