"use client";

import { TransitionLink } from "../transition-link";
import { insetClass } from "./incase-tokens";

/**
 * §3.13 — next-project cards.
 * Named explicitly rather than derived from array order, because Incase sits
 * between Oro and Vesta in `workItems` and the handoff asks for both of them.
 */
const NEXT = [
  {
    slug: "vesta",
    title: "Vesta",
    blurb: "An AI-powered companion to help couples stay close.",
  },
  {
    slug: "oro",
    title: "Oro",
    blurb: "A video-first restaurant discovery and booking platform.",
  },
];

export function IncaseNextProjects() {
  return (
    <div className={`${insetClass} pb-32 md:pb-48`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {NEXT.map((project) => (
          <TransitionLink
            key={project.slug}
            href={`/work/${project.slug}`}
            className="block rounded-2xl md:rounded-3xl p-8 md:p-14 bg-[#111111] hover:bg-[#161616] transition-colors duration-300"
          >
            <p
              className="text-[11px] font-bold uppercase"
              style={{
                letterSpacing: ".1em",
                color: "#71717A",
                fontFamily: "var(--font-inter)",
              }}
            >
              Next
            </p>
            <h3
              className="mt-5 text-3xl md:text-[34px] italic text-white"
              style={{ fontFamily: "'Noe Display', serif" }}
            >
              {project.title}
            </h3>
            <p
              className="mt-4 text-[15px] max-w-[420px]"
              style={{ color: "#A1A1AA", lineHeight: 1.65 }}
            >
              {project.blurb}
            </p>
          </TransitionLink>
        ))}
      </div>
    </div>
  );
}
