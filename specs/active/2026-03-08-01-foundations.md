---
title: "OKLCH Generator — 1/5 Foundations"
status: active
created: 2026-03-08
estimate: 2h
tier: mini
depends: none
---

# OKLCH Generator — 1/5 Foundations

## Context

Bootstrap the greenfield project: Next.js 15 + React 19 + Tailwind v4 + Lyse Registry. The goal is a running dev server with layout shell (header, footer, theme toggle, dark mode), design tokens, and all TypeScript interfaces. This is the foundation every subsequent spec builds on.

Critical gate: Lyse Registry components must work with Next.js 15 + Tailwind v4. If they don't, fallback to raw shadcn/ui + Radix.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| Project root | CREATE | `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `postcss.config.mjs` |
| `types/color.ts` | CREATE | All TypeScript interfaces (OklchColor, PaletteShade, Palette, ColorInput, etc.) |
| `app/layout.tsx` | CREATE | Root layout — next-themes provider, next/font, metadata |
| `app/globals.css` | CREATE | Tailwind v4 `@import "tailwindcss"` + `@theme` config + design tokens (light/dark) + shadcn bridge vars |
| `app/page.tsx` | CREATE | Placeholder generator page (will be built in spec 3) |
| `components/ui/` | CREATE | 9 Lyse Registry components (button, badge, input, tabs, toast, tooltip, toggle, select, dropdown-menu) — dual-file pattern. **Committed to repo after install** (no runtime registry dependency). |
| `components/layout/header.tsx` | CREATE | Nav bar: title + links (Catalogue, Random) + theme toggle |
| `components/layout/footer.tsx` | CREATE | Credits, MIT license, link |
| `components/layout/theme-toggle.tsx` | CREATE | Dark/light mode switch via next-themes |

**Files:** ~25 create | 0 modify | 0 affected
**Reuse:** Lyse Registry (9 components via shadcn CLI), next-themes (dark mode without flash)
**Breaking changes:** None (greenfield)
**New dependencies:** next, react, react-dom, culori, apca-w3, class-variance-authority, @radix-ui/* (tabs, tooltip, toggle, select, dropdown-menu), clsx, tailwind-merge, tailwindcss, @tailwindcss/postcss, next-themes, typescript, eslint, eslint-config-next

**NOTE:** No `tailwind.config.ts` — Tailwind v4 uses CSS-first configuration via `@theme` directive in `globals.css`. The old JS config file is deprecated in TW4.

**NOTE:** `apca-w3` replaces `apcach` for contrast measurement. apcach generates colors BY contrast target; `apca-w3` MEASURES contrast OF existing colors (raw Lc values). This was validated during spec review — not a spike, a decision.

## User Journey (MANDATORY)

### Primary Journey

ACTOR: Developer (self)
GOAL: Run `npm run dev` and see a working app shell with dark mode toggle
PRECONDITION: Empty directory

1. Developer runs setup commands
   → System installs deps, Lyse Registry components
   → Developer sees no errors

2. Developer runs `npm run dev`
   → System starts dev server on :3000
   → Developer sees header with "OKLCH Generator" title, nav links, theme toggle, footer

3. Developer clicks theme toggle
   → System switches between light/dark mode via next-themes
   → Developer sees UI adapt (background, text, borders change)

4. Developer refreshes page
   → System reads theme preference from localStorage (next-themes handles this)
   → Developer sees same theme as before refresh — no flash

POSTCONDITION: Running dev server with layout shell, dark mode, all Lyse components available

### Error Journeys

E1. Lyse Registry component fails to install
   Trigger: shadcn CLI can't fetch from lyse-registry.vercel.app
   1. Developer runs install command → CLI returns error
   2. Developer falls back to standard shadcn components
   Recovery: Use `npx shadcn@latest add button` (default registry) or raw Radix

### Edge Cases

EC1. System prefers dark mode: App loads in dark mode by default (next-themes respects `prefers-color-scheme`)
EC2. No localStorage: Toggle works in session, just doesn't persist

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN a fresh clone WHEN developer runs `npm install && npm run dev` THEN dev server starts on :3000 without errors
- [ ] AC-2: GIVEN the running app WHEN developer visits `http://localhost:3000` THEN header with title "OKLCH Generator", nav links (Catalogue, Random), and theme toggle is visible
- [ ] AC-3: GIVEN the running app WHEN developer clicks theme toggle THEN UI switches between light and dark mode
- [ ] AC-4: GIVEN dark mode is selected WHEN developer refreshes the page THEN dark mode persists (localStorage) with zero flash of wrong theme
- [ ] AC-5: GIVEN the project WHEN developer runs `npm run lint && npm run typecheck && npm run build` THEN all pass clean
- [ ] AC-6: GIVEN `types/color.ts` WHEN imported in any file THEN OklchColor, PaletteShade, Palette, ShadeStep, ColorFormat, GamutStatus, ContrastLevel interfaces are available and correctly typed
- [ ] AC-7: GIVEN the project WHEN font is loaded THEN uses `next/font` with `display: 'optional'` (no CLS from font swap)

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN the system prefers dark mode WHEN user loads the app for the first time (no localStorage) THEN app renders in dark mode without flash of light mode (next-themes script injection)

### Should Have

- [ ] AC-8: GIVEN Lyse Registry components WHEN inspected THEN all 9 component pairs (.tsx + .css) are installed in `components/ui/` and committed to repo

## Scope

- [ ] 1. Initialize Next.js 15 + React 19 + TypeScript project → AC-1, AC-5
- [ ] 2. Configure Tailwind v4 via `@theme` in `globals.css` + `@tailwindcss/postcss` in PostCSS config (NO tailwind.config.ts) → AC-1, AC-5
- [ ] 3. Install 9 Lyse Registry components via shadcn CLI, **commit to repo** (pin versions, remove runtime registry dependency) → AC-8
- [ ] 4. Create `types/color.ts` with all TypeScript interfaces (including `shades?: PaletteShade[]` optional field on Palette for pre-computed static palettes) → AC-6
- [ ] 5. Create `app/globals.css` with `@import "tailwindcss"`, `@theme` config, design tokens (light + dark, 3 token layers) → AC-3, AC-E1
- [ ] 6. Install `next-themes` + create root layout with ThemeProvider (class strategy, `suppressHydrationWarning` on html) → AC-2, AC-3, AC-4, AC-E1
- [ ] 7. Configure `next/font` with Inter or system font, `display: 'optional'` → AC-7
- [ ] 8. Create header component (title + nav links + theme toggle slot) → AC-2
- [ ] 9. Create theme-toggle component (wraps next-themes `useTheme`) → AC-3, AC-4, AC-E1
- [ ] 10. Create footer component → AC-2
- [ ] 11. Create placeholder `app/page.tsx` → AC-1
- [ ] 12. Init git repo with `.gitignore` → AC-1
- [ ] 13. Add tsconfig path alias: `"culori": ["node_modules/culori/fn"]` to enforce tree-shaking imports globally → AC-5

### Out of Scope

- Color engine (spec 2)
- Hooks (spec 3)
- Generator UI (spec 3)
- Palette data (spec 4)
- Catalogue page (spec 4)
- Random page (spec 5)

## Quality Checklist

### Blocking

- [ ] All Must Have ACs (AC-1 through AC-7) passing
- [ ] AC-E1 passing (no dark mode flash)
- [ ] `npm run lint && npm run typecheck && npm run build` clean
- [ ] No hardcoded secrets or credentials
- [ ] Dark mode renders correctly (system pref + toggle + persistence)
- [ ] No `tailwind.config.ts` file in project (TW4 CSS-first only)
- [ ] Lyse components committed to repo (no runtime registry dependency)

### Advisory

- [ ] AC-8 passing (all 9 Lyse components installed)
- [ ] Lighthouse Performance ≥ 95 on empty shell
- [ ] All Lyse component CSS imports compatible with Tailwind v4 `@layer`

## Test Strategy

Runner: not configured — will set up in spec 2 | E2E: none | TDD: N/A for setup spec
AC-1 → Manual (dev server starts) | AC-5 → Manual (quality gates pass)
AC-E1 → Manual (dark mode test in browser — system dark + refresh)
Mocks: none

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Lyse Registry CLI fails with Next.js 15 | HIGH | MED | Try install first; fallback: raw shadcn/ui. Commit components to repo immediately after install. |
| Lyse CSS `@layer` conflicts with Tailwind v4 `@layer` | HIGH | MED | Test Lyse Button rendering on day 1 before installing all 9; if conflict, isolate Lyse CSS or use default shadcn |
| Dark mode flash on first load | MED | LOW | Mitigated by next-themes script injection (mandatory, not optional) |
| Font CLS | MED | LOW | `next/font` with `display: 'optional'` eliminates swap-based CLS |

**Kill criteria:** If Lyse Registry is fundamentally incompatible with Next.js 15 + Tailwind v4 after 30min debugging, fall back to standard shadcn/ui registry.

## Analysis

**Assumptions:** Lyse Registry CLI works with Next.js 15 → RISKY (test immediately) | Tailwind v4 CSS-first config works in App Router → VALID | next-themes handles dark mode without flash → VALID (script injection in head)
**Blind Spots:** [Perf] Font loading — mitigated (next/font + display:optional added) | [Arch] Lyse CSS @layer conflicts with TW4 → test day 1
**Failure Hypothesis:** IF Lyse Registry CSS tokens conflict with Tailwind v4 `@theme` THEN component styling breaks BECAUSE both define `--background`, `--foreground` etc. → Mitigation: test one component (Button) before installing all 9; Lyse tokens take precedence in globals.css
**The Real Question:** Confirmed — pure setup. Only real risk is Lyse Registry compat.
**Open Items:** [risk] Lyse Registry compat → explore immediately in scope item 3 | [risk] Lyse CSS @layer → explore in scope item 5

**Spec review applied: 2026-03-08** — tailwind.config.ts removed (TW4 CSS-first), apcach→apca-w3, next-themes mandatory, font loading added, Lyse components pinned to repo.

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | Init Next.js project | pending | - |
| 2 | Configure Tailwind v4 (CSS-first) | pending | - |
| 3 | Install + commit Lyse Registry | pending | - |
| 4 | Create types/color.ts | pending | - |
| 5 | Create globals.css (@theme) | pending | - |
| 6 | Root layout + next-themes | pending | - |
| 7 | Font config (next/font) | pending | - |
| 8 | Create header | pending | - |
| 9 | Create theme-toggle | pending | - |
| 10 | Create footer | pending | - |
| 11 | Create placeholder page | pending | - |
| 12 | Init git | pending | - |
| 13 | tsconfig culori/fn alias | pending | - |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-08T19:00:00Z | - | Created |
| spec-review | 2026-03-08T20:00:00Z | - | Merged: TW4 CSS-first, apca-w3, next-themes, font, Lyse pinning |
