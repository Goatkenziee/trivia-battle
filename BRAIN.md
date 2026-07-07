# BRAIN.md

## What this app does
i want to build a arcade game multiplayer like questions that battle for now make it agaisnt computer two screen split shwoign other side questions pop up and we answer points based system ral funny fun game

## Current state
A split-screen trivia battle game — you vs the computer. 10 rounds of funny questions, timer countdown, streak bonuses, animations. Built with Next.js 14 App Router, Tailwind CSS, Framer Motion.

The build was failing because `pages/_document.tsx` existed alongside the `app/` directory. In Next.js 14 App Router mode, having a `pages/` dir causes the build to scan it for pages, and `_document` is not a valid page export — producing `PageNotFoundError: Cannot find module for page: /_document`. Fix: deleted `pages/_document.tsx` (the `pages/` dir is now gone).

## Tech stack and why
- Next.js 14.2.15 (App Router) — framework
- React 18 — UI
- Tailwind CSS 3 — styling
- Framer Motion — animations
- Lucide React — icons

## What has been built
- .gitignore
- PROJECT_STATE.json
- app/globals.css
- app/layout.tsx
- app/loading.tsx
- app/not-found.tsx
- app/page.tsx (main game — menu, split-screen battle, results)
- components/ui/bento-grid.tsx
- components/ui/button.tsx
- components/ui/card.tsx
- components/ui/shimmer-button.tsx
- lib/utils.ts
- next-env.d.ts
- next.config.mjs
- package.json
- postcss.config.mjs
- tailwind.config.ts
- tsconfig.json

## Latest verification
- [FIXED] Deleted `pages/_document.tsx` — this was causing the build failure. Next.js 14 App Router does not need a `pages/` directory. The build should now succeed.

## What's still pending
- Run `npm run build` to verify the fix (sandbox unavailable this run — needs a fresh sandbox session)
- Deploy to Vercel / GitHub

## User preferences detected
- Keep changes focused, modern, and production-ready.

## Run notes
- Last updated: 2026-07-07T01:42:35.296Z
- Autonomous iteration: 0
- Fix applied: deleted pages/_document.tsx (removed pages/ dir entirely)
