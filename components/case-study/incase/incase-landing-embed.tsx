"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cardClass, INCASE_SURFACE, insetClass, stackGapClass } from "./incase-tokens";

/**
 * §3.11 — the launch landing page, live inside the iMac render.
 *
 * The page is rendered at a fixed 1440px and scaled to fit the screen box, then
 * paced through its own content bands: hold, eased glide, hold, restart.
 */

const FRAME_WIDTH = 1440;
const HOLD = 1.5;
const GLIDE = 1.9;
const LEG = HOLD + GLIDE;
const TICK_MS = 32;

const easeInOutCubic = (a: number) =>
  a < 0.5 ? 4 * a * a * a : 1 - Math.pow(-2 * a + 2, 3) / 2;

export function IncaseLandingEmbed() {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Scale the 1440px frame down into whatever the screen box measures.
  useEffect(() => {
    const fit = () => {
      const box = boxRef.current;
      const frame = frameRef.current;
      if (!box || !frame) return;
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (!w || !h) return;
      const k = w / FRAME_WIDTH;
      frame.style.height = `${h / k}px`;
      frame.style.transform = `scale(${k})`;
    };

    fit();
    window.addEventListener("resize", fit);

    let ro: ResizeObserver | undefined;
    if (boxRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(boxRef.current);
    }

    // The box is sized off the iMac image, so refit once it decodes.
    const frame = frameRef.current;
    frame?.addEventListener("load", fit);

    return () => {
      window.removeEventListener("resize", fit);
      ro?.disconnect();
      frame?.removeEventListener("load", fit);
    };
  }, []);

  // Paced auto-scroll through the landing page's content bands.
  useEffect(() => {
    let stops: number[] | null = null;
    let stopsMax = -1;
    let t0: number | null = null;

    const tick = () => {
      const frame = frameRef.current;
      if (!frame) return;

      let win: Window | null;
      let doc: Document | null;
      try {
        win = frame.contentWindow;
        doc = win?.document ?? null;
      } catch {
        return; // frame not ready
      }
      if (!win || !doc?.body) return;

      const max = doc.body.scrollHeight - win.innerHeight;
      if (max <= 0) return;

      if (!stops || stopsMax !== max) {
        const nav = doc.getElementById("topnav");
        const navH = nav?.offsetHeight ?? 0;
        const bands = Array.from(
          doc.querySelectorAll<HTMLElement>("body > div")
        ).filter((el) => el.id !== "topnav" && el.offsetHeight > 200);

        const raw = bands.map((el) =>
          Math.min(max, Math.max(0, el.offsetTop - navH))
        );
        const next = [0];
        raw.forEach((v) => {
          if (v - next[next.length - 1] > 80) next.push(v);
        });
        if (next[next.length - 1] < max - 40) next.push(max);
        stops = next;
        stopsMax = max;
      }

      const cycle = (stops.length - 1) * LEG + HOLD + 2.2;
      if (t0 === null) t0 = performance.now();
      const u = ((performance.now() - t0) / 1000) % cycle;

      let y = stops[stops.length - 1];
      for (let i = 0; i < stops.length - 1; i++) {
        const s = i * LEG;
        if (u < s + HOLD) {
          y = stops[i];
          break;
        }
        if (u < s + LEG) {
          y =
            stops[i] +
            (stops[i + 1] - stops[i]) * easeInOutCubic((u - s - HOLD) / GLIDE);
          break;
        }
      }
      win.scrollTo(0, y);
    };

    const iv = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <div className={`${insetClass} ${stackGapClass}`}>
      <div
        className={`${cardClass} relative overflow-hidden`}
        style={{ background: INCASE_SURFACE.coolPlate }}
      >
        <Image
          src="/Work/Incase/landing-page-imac.png"
          alt="The Incase landing page on a desktop display"
          width={1672}
          height={1339}
          className="block w-full h-auto"
          sizes="(max-width: 768px) 100vw, calc(100vw - 96px)"
        />
        <div
          ref={boxRef}
          className="absolute overflow-hidden"
          style={{
            left: "26.5%",
            top: "13.1%",
            width: "47.4%",
            height: "48.7%",
            background: INCASE_SURFACE.warmPlate,
          }}
        >
          <iframe
            ref={frameRef}
            src="/Work/Incase/embeds/landing-page.html"
            title="Incase landing page"
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            aria-hidden
            style={{
              width: FRAME_WIDTH,
              border: 0,
              display: "block",
              transformOrigin: "0 0",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
