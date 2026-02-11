# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a **Next.js 15 portfolio site** using the App Router, React 19, TypeScript, and Tailwind CSS 4.

### Key Technologies
- **3D/Graphics**: Three.js with custom GLSL shaders for visual effects
- **Animation**: Framer Motion for UI animations, react-spring for physics-based animations
- **Styling**: Tailwind CSS with `cn()` utility from `lib/utils.ts` for class merging

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist, Geist Mono, and Inter fonts (available as CSS variables `--font-geist-sans`, `--font-geist-mono`, `--font-inter`)
  - `globals.css` - Global styles including custom font "Noe Display"
- `components/ui/` - Reusable UI components
- `lib/utils.ts` - Utility functions (`cn` for Tailwind class merging)
- `public/Assets/` - Static assets including SVG files

### Video / Media Storage
- **All video files are hosted on Vercel Blob Storage**, not in the git repo
- The blob base URL is exported as `BLOB_BASE` from `lib/utils.ts`
- When adding new videos: upload to the blob store using `vercel blob put <file> -p <pathname>`, then reference via `` `${BLOB_BASE}/<pathname>` `` in code
- **Never commit video files (mp4/mov/webm) to git** — they are gitignored
- Blob store name: `portfolio-videos` (store ID: `store_oYabYty4jH8SaGal`, region: iad1)
- The `BLOB_READ_WRITE_TOKEN` env var is set in Vercel project settings (production + preview)

### Component Patterns
- Components use `"use client"` directive when they need client-side interactivity
- The `FloatingDock` component provides responsive navigation with hover animations (desktop) and expandable menu (mobile)
- `EmilyCanvas` demonstrates the pattern for Three.js integration: custom GLSL shaders with multi-pass rendering (Kawase blur) and mouse interaction
