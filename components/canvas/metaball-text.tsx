"use client";

import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function Metaballs({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = 800;
    const height = 600;

    // Initialize blobs
    const initialBlobs: Blob[] = [];
    const numBlobs = 6;

    for (let i = 0; i < numBlobs; i++) {
      initialBlobs.push({
        x: 100 + Math.random() * (width - 200),
        y: 100 + Math.random() * (height - 200),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 40 + Math.random() * 60,
      });
    }
    blobsRef.current = initialBlobs;

    // Create initial circles
    const blobGroup = svg.getElementById("blobs");
    if (blobGroup) {
      blobGroup.innerHTML = "";
      initialBlobs.forEach((blob) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", blob.x.toString());
        circle.setAttribute("cy", blob.y.toString());
        circle.setAttribute("r", blob.radius.toString());
        circle.setAttribute("fill", "#e6e6e6");
        blobGroup.appendChild(circle);
      });
    }

    const animate = () => {
      const blobGroup = svg.getElementById("blobs");
      if (!blobGroup) return;

      blobsRef.current.forEach((blob, i) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges
        if (blob.x < blob.radius || blob.x > width - blob.radius) {
          blob.vx *= -1;
          blob.x = Math.max(blob.radius, Math.min(width - blob.radius, blob.x));
        }
        if (blob.y < blob.radius || blob.y > height - blob.radius) {
          blob.vy *= -1;
          blob.y = Math.max(blob.radius, Math.min(height - blob.radius, blob.y));
        }

        const circle = blobGroup.children[i] as SVGCircleElement;
        if (circle) {
          circle.setAttribute("cx", blob.x.toString());
          circle.setAttribute("cy", blob.y.toString());
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-auto max-h-[70vh]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12"
              result="goo"
            />
          </filter>
        </defs>

        <g filter="url(#goo)">
          <g id="blobs" />
        </g>
      </svg>
    </div>
  );
}
