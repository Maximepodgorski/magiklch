---
title: "OKLCH Generator — 5/5 Random Page & Polish"
status: active
created: 2026-03-08
estimate: 2h
tier: mini
depends: 04-catalogue
---

# OKLCH Generator — 5/5 Random Page & Polish

## Context

Final spec: build the random palette page (`/random`) and polish for release. Random page generates palettes with constrained randomness (hue 0-360, chroma 0.08-0.25). Polish covers performance audit, meta tags, and final validation. After this spec, the MVP is shippable.

**Spec review changes:** A11y (ARIA, keyboard, focus) moved to spec 3. This spec is now lighter: random page + responsive fixes + performance + meta + release gates. Lighthouse A11y ≥ 95 is **blocking** (not advisory). Bundle target revised to 200KB gzipped (150KB was unrealistic with Radix stack).

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `app/random/page.tsx` | CREATE | Random palette page with shuffle + open in generator |
| `app/layout.tsx` | MODIFY | Add meta tags, OG image |
| `components/layout/header.tsx` | MODIFY | Add skip-to-content link |
| `lib/utils.ts` | MODIFY | Add random palette generation helper |
| `public/og-image.png` | CREATE | Open Graph image (placeholder) |

**Files:** 2 create | 3 modify | 0 affected
**Reuse:** Lyse Button (shuffle, open in generator), existing palette-grid for random display, use-palette hook for URL sync
**Breaking changes:** None
**New dependencies:** None

## User Journey (MANDATORY)

### Primary Journey — Random Exploration

ACTOR: Developer looking for inspiration
GOAL: Generate random palettes until finding one they like, then open in generator
PRECONDITION: App running (specs 1-4)

1. User navigates to `/random`
   → System generates random hue + chroma **client-side on mount**, then `router.replace` to set URL params
   → User sees a random palette with 11 shades (brief loading state before URL settles)

2. User clicks [Shuffle]
   → System generates new random hue + chroma, replaces URL
   → User sees a completely new palette instantly

3. User sees "Hue: 237° Chroma: 0.198" + human-readable label ("Cool blue, medium saturation")
   → System displays current random params with plain-language descriptor

4. User clicks [Open in Generator]
   → System navigates to `/?h=237&c=0.198`
   → User can fine-tune the palette

5. User clicks [Share]
   → System copies `/random?h=237&c=0.198` to clipboard
   → User can share the specific random palette

POSTCONDITION: User found an inspiring palette and can edit or share it

### Error Journeys

E1. Random page URL with out-of-range params
   Trigger: `/random?h=500&c=2`
   1. System detects invalid params → Clamps h to 360, c to 0.25
   2. User sees a valid palette (no error)
   Recovery: Automatic clamping, no user action needed

### Edge Cases

EC1. Shuffle produces same hue twice in a row: Extremely unlikely but acceptable
EC2. Random chroma 0.08 (minimum): Palette is low-saturation but valid
EC3. Direct URL with valid params (`/random?h=237&c=0.198`): Shows that specific palette (no random on load)

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN `/random` WHEN loaded THEN a random palette is displayed with 11 shades
- [ ] AC-2: GIVEN random page WHEN user clicks Shuffle THEN a new random palette generates instantly (different from previous)
- [ ] AC-3: GIVEN random page WHEN rendered THEN shows hue, chroma values, and human-readable label (e.g., "Cool blue, medium saturation")
- [ ] AC-4: GIVEN random page WHEN user clicks "Open in Generator" THEN navigates to `/?h={hue}&c={chroma}` with correct palette
- [ ] AC-5: GIVEN random page WHEN user clicks Share THEN URL with random params is copied to clipboard
- [ ] AC-6: GIVEN the entire app WHEN viewport is sm (<640px) THEN all pages render correctly in 2-column (or 1-column for catalogue) layout
- [ ] AC-7: GIVEN the app WHEN `npm run build` completes THEN no TypeScript errors, no lint errors, build succeeds
- [ ] AC-8: GIVEN the app WHEN page meta tags are inspected THEN title, description, and OG image are present per route
- [ ] AC-9: GIVEN the app WHEN Lighthouse Accessibility audit runs THEN score ≥ 95 **(BLOCKING)**
- [ ] AC-10: GIVEN skip-to-content link WHEN user presses Tab on page load THEN skip link appears and jumps to main content

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN `/random?h=500&c=2` WHEN loaded THEN params are clamped to valid ranges and a valid palette is shown

### Should Have

- [ ] AC-11: GIVEN the app WHEN Lighthouse Performance audit runs THEN score ≥ 95
- [ ] AC-12: GIVEN the app WHEN bundle analyzed THEN gzipped JS < 200KB per route (generator ≤ 150KB, catalogue ≤ 130KB, random ≤ 130KB)
- [ ] AC-13: GIVEN all animations WHEN `prefers-reduced-motion: reduce` is set THEN animations are disabled or instant

## Scope

### Random Page

- [ ] 1. Add random palette generation to `lib/utils.ts` — generateRandomParams() with constrained ranges + human-readable hue/chroma labels → AC-1, AC-3
- [ ] 2. Build `app/random/page.tsx` — random palette display + shuffle + share + "open in generator". **Init strategy:** client-side mount → generate → router.replace. If URL already has valid params, use those. → AC-1, AC-2, AC-3, AC-4, AC-5

### Polish

- [ ] 3. Add skip-to-content link in header → AC-10
- [ ] 4. Test and fix responsive breakpoints across all 3 pages → AC-6
- [ ] 5. Add page meta tags (title, description) per route → AC-8
- [ ] 6. Create placeholder OG image → AC-8
- [ ] 7. Add `@media (prefers-reduced-motion: reduce)` to disable toast slide, checkmark spring, shade hover lift → AC-13
- [ ] 8. Performance audit — verify culori/fn tree-shaking, check bundle size per route, lazy load Tooltip via `next/dynamic` → AC-11, AC-12
- [ ] 9. Lighthouse A11y audit — verify ≥ 95, fix any failures → AC-9
- [ ] 10. Final `npm run lint && npm run typecheck && npm run build` clean pass → AC-7

### Out of Scope

- Color blindness simulator
- Multi-palette workspace
- Export to Figma variables (file-based export — multi-format copy is in spec 3)
- Analytics
- Deployment pipeline (Vercel auto-deploys on push)

**Note:** L/C/H sliders and multi-format export are now in spec 3 scope (moved from V2 to V1).

## Quality Checklist

### Blocking

- [ ] All Must Have ACs (AC-1 through AC-10) passing
- [ ] AC-E1 passing
- [ ] **Lighthouse Accessibility ≥ 95** (blocking, not advisory)
- [ ] Random page generates different palettes on shuffle
- [ ] Skip-to-content link works
- [ ] No TypeScript errors, no lint errors
- [ ] Build succeeds clean
- [ ] Dark mode works on random page
- [ ] URL sharing roundtrip works for random page

### Advisory

- [ ] AC-11 (Lighthouse Perf ≥ 95)
- [ ] AC-12 (Bundle < 200KB per route)
- [ ] AC-13 (prefers-reduced-motion respected)
- [ ] No layout shifts on page load (CLS = 0)

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | configured | Vitest |
| E2E framework | TBD | Playwright if available from spec 3 |
| Test DB | N/A | |
| Mock inventory | 2 | Clipboard API, next/navigation |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | E2E | Random page loads with a palette |
| AC-2 | E2E | Shuffle generates new palette |
| AC-4 | E2E | "Open in Generator" navigates with correct params |
| AC-5 | E2E | Share copies URL to clipboard |
| AC-6 | Manual | Responsive at all breakpoints |
| AC-7 | CI | Build passes |
| AC-9 | CI | Lighthouse A11y ≥ 95 |
| AC-10 | E2E | Skip-to-content link works |
| AC-E1 | Unit | Invalid random params are clamped |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | Unit: out-of-range random URL params are clamped | BLOCKING |
| Edge Case | EC3 | E2E: direct URL with valid params shows that specific palette | BLOCKING |
| Spec Review | SR-1 | E2E: shuffle always produces valid palette (no crash on edge hues) | BLOCKING |
| Spec Review | SR-2 | CI: Lighthouse A11y ≥ 95 on all 3 routes | BLOCKING |

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| Clipboard API | Mock | Browser API |
| next/navigation | Mock | Standard pattern |
| Math.random | Real | Deterministic tests not needed for randomness |

### TDD Commitment

Random generation logic tested unit-style. Polish items validated via Lighthouse CI + manual.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Bundle > 200KB per route | MED | MED | Lazy load Tooltip + catalogue data; consider native `<select>` if Radix Select too heavy |
| Random page init (client generate → router.replace) causes flash | LOW | MED | Show loading skeleton until URL params settle |
| Lighthouse A11y < 95 | HIGH | LOW | All a11y built in spec 3; this is validation, not implementation |

**Kill criteria:** If bundle > 250KB per route after all optimizations, investigate replacing Radix Select with native `<select>` (saves ~17KB).

## State Machine

### Random State

```
┌──────────┐   visit /random    ┌───────────────┐   shuffle   ┌───────────────┐
│  (init)  │──────────────────▶│  LOADING       │───────────▶│  GENERATED    │
└──────────┘                   │  (client mount │            │  h=new_rand   │
                               │  → generate    │            │  c=new_rand   │
                               │  → replace URL)│            └───────┬───────┘
                               └───────┬────────┘                    │
                                       │                             │ shuffle
                                       ▼                             ▼
                               ┌───────────────┐            (same GENERATED)
                               │  GENERATED    │
                               │  h=rand       │
                               │  c=rand       │
                               └───────┬───────┘
                                       │  "Open in Generator"
                                       ▼
                               ┌───────────────┐
                               │  GENERATOR /  │
                               │  ?h=...&c=... │
                               └───────────────┘

If URL already has valid ?h=&c= on load → skip LOADING, go straight to GENERATED.
```

## Analysis

### Assumptions Challenged

| # | Assumption | Evidence For | Evidence Against | Verdict | Action |
|---|------------|-------------|-----------------|---------|--------|
| 1 | Chroma 0.08-0.25 produces good random palettes | Avoids extremes | Some hues look best at higher chroma | VALID | → acceptable for exploration |
| 2 | Lighthouse A11y ≥ 95 is achievable | All a11y built in spec 3 | May have edge cases (dynamic aria-labels, toast timing) | VALID | → validate, fix in this spec |
| 3 | 200KB per-route budget is realistic | Removed 2 advisory Radix from critical path (lazy Tooltip) | Still tight with Select + DropdownMenu | RISKY | → measure after build, native fallbacks ready |

### Blind Spots

1. **[Perf]** Lazy loading strategy for Tooltip needs testing — `next/dynamic` with `ssr: false` may flash
2. **[SEO]** No sitemap — low priority for a tool, skip for MVP

### Failure Hypotheses

| # | IF | THEN | BECAUSE | Severity | Mitigation |
|---|-----|------|---------|----------|------------|
| FH-1 | Bundle > 250KB after all optimizations | Lighthouse perf 80-85, slow mobile | Radix primitives too heavy | MED | Native `<select>` fallback for format toggle (saves ~17KB) |
| FH-2 | Random page client-side init causes hydration mismatch | Console errors, wrong initial render | Server has no random values, client generates them | LOW | Accept brief loading state; `useEffect` + mounted guard |

### The Real Question

This is the release gate. The random page is simple (~50 LOC). The real work is validation: Lighthouse A11y (blocking), responsive fixes, performance audit, meta tags. These are the details that separate a prototype from a shippable product.

### Open Items

- [resolved] A11y moved to spec 3 (validation only here)
- [resolved] Bundle target 200KB (not 150KB)
- [resolved] Lighthouse A11y blocking (not advisory)
- [resolved] prefers-reduced-motion added

**Spec review applied: 2026-03-08** — A11y moved to spec 3, Lighthouse A11y blocking, bundle target 200KB, prefers-reduced-motion, human-readable random labels, random state init strategy.

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | Random generation logic (utils.ts) | [x] Complete | 1 |
| 2 | Random page (/random + random-shell.tsx) | [x] Complete | 1 |
| 3 | Skip-to-content link (header) | [x] Complete | 1 |
| 4 | Responsive fixes (header max-w, padding) | [x] Complete | 1 |
| 5 | Meta tags (per-route title + description) | [x] Complete | 1 |
| 6 | OG image | skipped (placeholder — no image gen tool) | - |
| 7 | prefers-reduced-motion (globals.css) | [x] Complete | 1 |
| 8 | Performance audit | deferred — need running app | - |
| 9 | Lighthouse A11y audit | deferred — need running app | - |
| 10 | Final quality gates (lint+type+build+test) | [x] Complete — 0 errors, 84 tests | 1 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-08T19:00:00Z | - | Created |
| spec-review | 2026-03-08T20:00:00Z | - | Merged: a11y to spec 3, Lighthouse blocking, 200KB budget, reduced-motion |
