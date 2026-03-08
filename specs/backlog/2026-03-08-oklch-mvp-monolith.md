---
title: OKLCH Palette Generator — MVP
status: active
created: 2026-03-08
estimate: 16h
tier: standard
---

# OKLCH Palette Generator — MVP

## Context

Greenfield open-source web app to generate, browse, and share OKLCH color palettes. No color tool today combines OKLCH generation + APCA contrast + gamut awareness in a single, shareable, no-signup UI. Built on the Lyse Registry (React 19 + Next.js 15 + Tailwind v4 + shadcn pattern). Pure client-side, zero backend.

Full documentation in `/docs/` — PRODUCT.md, COLORS.md, ENGINEERING.md, DESIGN.md, PALETTES.md.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| Project root | CREATE | `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.gitignore` |
| `types/color.ts` | CREATE | All TypeScript interfaces — OklchColor, PaletteShade, Palette, ColorInput |
| `lib/` (6 files) | CREATE | color-engine, color-parser, color-formatter, gamut, contrast, curves |
| `hooks/` (3 files) | CREATE | use-palette, use-color-format, use-copy |
| `data/` (2 files) | CREATE | tailwind-palettes, curated-palettes |
| `components/ui/` | CREATE | Lyse Registry components (9 components, dual-file pattern) |
| `components/palette/` (5 files) | CREATE | palette-grid, shade-card, color-input, palette-header, format-toggle |
| `components/catalogue/` (3 files) | CREATE | catalogue-grid, palette-preview, catalogue-filter |
| `components/layout/` (3 files) | CREATE | header, footer, theme-toggle |
| `components/shared/` (3 files) | CREATE | copy-button, gamut-badge, contrast-badge |
| `app/` (4 files) | CREATE | layout, page, catalogue/page, random/page |
| `app/globals.css` | CREATE | Tailwind imports + design tokens + dark mode |

**Files:** ~40 create | 0 modify | 0 affected
**Reuse:** Lyse Registry components (Button, Badge, Input, Tabs, Toast, Tooltip, Toggle, Select, DropdownMenu), culori API, apcach API
**Breaking changes:** None (greenfield)
**New dependencies:** next, react, culori, apcach, CVA, Radix UI primitives, clsx, tailwind-merge

## User Journey (MANDATORY)

### Primary Journey — Generate & Copy

ACTOR: Design engineer
GOAL: Generate an OKLCH palette from a base color and copy values for use in a project
PRECONDITION: User has a browser, no account needed

1. User lands on `/`
   → System shows a pre-generated blue palette (default: `#3b82f6`)
   → User sees 11 shade cards with swatches, values, contrast badges

2. User types a color in the input field (`#e11d48`)
   → System parses input, detects format (HEX), converts to OKLCH
   → User sees palette regenerate instantly with new shades

3. User clicks a shade card's HEX value
   → System copies `#e11d48` to clipboard
   → User sees toast "Copied #e11d48" (2s)

4. User selects "OKLCH" from format dropdown
   → System updates all shade cards to show OKLCH values
   → User sees `oklch(58.6% 0.253 17.585)` format on all cards

5. User clicks [Share]
   → System copies current URL to clipboard (URL already contains palette state)
   → User sees toast "Link copied"

POSTCONDITION: User has palette values in clipboard, shareable URL available

### Primary Journey — Browse Catalogue

ACTOR: UI designer
GOAL: Browse pre-built palettes and use one as a starting point
PRECONDITION: None

1. User navigates to `/catalogue`
   → System displays grid of palette preview cards (22 Tailwind + curated)
   → User sees name, source tag, mini color stripe per card

2. User types "green" in search
   → System filters palettes by name
   → User sees matching palettes (green, emerald, lime, moss)

3. User clicks "Emerald" palette card
   → System navigates to `/?h=162.48&c=0.17&name=emerald`
   → User sees full 11-shade emerald palette in generator

POSTCONDITION: User is in generator with selected palette

### Primary Journey — Random Exploration

ACTOR: Developer looking for inspiration
GOAL: Generate random palettes until finding one they like

1. User navigates to `/random`
   → System generates a random hue (0-360) + random chroma (0.08-0.25)
   → User sees a random palette

2. User clicks [Shuffle]
   → System generates new random hue + chroma
   → User sees a completely new palette instantly

3. User clicks [Open in Generator]
   → System navigates to `/` with palette params in URL
   → User can fine-tune the palette

POSTCONDITION: User is in generator with randomized palette

### Error Journeys

E1. Invalid color input
   Trigger: User types gibberish (`asdf`) in color input
   1. User types invalid string
      → System shows red border on input + message "Invalid color format"
      → Previous valid palette remains visible
   2. User corrects input to valid color
      → System removes error state, generates new palette
   Recovery: Palette never disappears — last valid palette stays

E2. Clipboard API unavailable
   Trigger: Browser doesn't support Clipboard API (older browsers, some mobile)
   1. User clicks copy button
      → System detects clipboard unavailable
      → User sees toast "Copy not supported — select and copy manually"
   Recovery: User can still select text manually

E3. Out-of-gamut extreme input
   Trigger: User enters a highly saturated OKLCH color (`oklch(0.5 0.4 180)`)
   1. User enters extreme chroma color
      → System generates palette with gamut warnings on affected shades
      → User sees P3 / Clamped badges on extreme shades
   Recovery: Automatic — gamut-mapped values are still provided

### Edge Cases

EC1. Empty input: Show default palette, no error
EC2. URL with invalid params (`?h=999&c=5`): Clamp to valid ranges (h: 0-360, c: 0-0.4)
EC3. Very dark input (L < 0.1): Generate palette normally — shade 950 may be near-black
EC4. Achromatic input (C = 0): Generate grayscale palette — all chroma multipliers produce 0
EC5. Hue wrapping (pink/rose): Handle hue values that cross the 0/360 boundary

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING — all must pass to ship)

- [ ] AC-1: GIVEN the generator page WHEN user first loads `/` THEN a default blue palette (11 shades) is displayed immediately without interaction
- [ ] AC-2: GIVEN the color input WHEN user types a valid HEX color (`#e11d48`) THEN palette regenerates within 100ms with 11 correct shades
- [ ] AC-3: GIVEN the color input WHEN user types a valid OKLCH string (`oklch(0.6 0.2 259)`) THEN palette generates correctly
- [ ] AC-4: GIVEN a generated palette WHEN user clicks any shade's color value THEN value is copied to clipboard and toast confirms
- [ ] AC-5: GIVEN the format selector WHEN user switches to HEX/OKLCH/HSL/CSS var THEN all shade cards update to display the selected format
- [ ] AC-6: GIVEN a generated palette WHEN user clicks Share THEN current URL (containing palette state) is copied to clipboard
- [ ] AC-7: GIVEN a URL with palette params (`?h=259&c=0.214`) WHEN user opens it THEN the correct palette is displayed
- [ ] AC-8: GIVEN each shade card WHEN shade is generated THEN APCA Lc contrast values (vs white and vs black) are displayed with correct badge (AAA/AA/A/Fail)
- [ ] AC-9: GIVEN each shade card WHEN shade is outside sRGB gamut THEN a P3 badge is visible
- [ ] AC-10: GIVEN the catalogue page WHEN user visits `/catalogue` THEN all 22 Tailwind v4 palettes + curated palettes are displayed as preview cards
- [ ] AC-11: GIVEN a palette preview in catalogue WHEN user clicks it THEN user is navigated to generator with that palette's base color in URL
- [ ] AC-12: GIVEN the random page WHEN user visits `/random` THEN a random palette is generated and displayed
- [ ] AC-13: GIVEN the random page WHEN user clicks Shuffle THEN a new random palette is generated instantly
- [ ] AC-14: GIVEN the UI WHEN system preference is dark mode THEN entire UI renders in dark theme
- [ ] AC-15: GIVEN the header WHEN user toggles dark mode THEN theme switches and preference persists across page reloads

### Error Criteria (BLOCKING — all must pass)

- [ ] AC-E1: GIVEN the color input WHEN user types an invalid color string THEN input shows error state AND previous valid palette remains visible
- [ ] AC-E2: GIVEN URL params WHEN `h`, `c`, or `l` values are outside valid ranges THEN values are clamped to valid ranges without error
- [ ] AC-E3: GIVEN the clipboard API WHEN it is unavailable THEN user sees a fallback message (no crash, no silent failure)

### Should Have (ship without, fix soon)

- [ ] AC-16: GIVEN the generator WHEN user opens "Advanced" panel THEN lightness curve and chroma scaling controls are available
- [ ] AC-17: GIVEN the catalogue WHEN user types in search THEN palettes are filtered by name in real-time
- [ ] AC-18: GIVEN the entire UI WHEN user navigates with keyboard only THEN all interactive elements are reachable and operable

## Scope

Organized in 8 phases. Each phase is independently shippable but builds on the previous.

### Phase 1: Project Foundations

- [ ] 1.1. Initialize Next.js 15 + React 19 + TypeScript + Tailwind v4 project → AC-1
- [ ] 1.2. Install Lyse Registry components via shadcn CLI (9 components) → AC-1
- [ ] 1.3. Create `types/color.ts` with all TypeScript interfaces → AC-1
- [ ] 1.4. Create `app/globals.css` with design tokens (light + dark mode) → AC-14, AC-15
- [ ] 1.5. Create root layout (`app/layout.tsx`) with dark mode, fonts, metadata → AC-14, AC-15
- [ ] 1.6. Create header + footer + theme-toggle components → AC-14, AC-15
- [ ] 1.7. Set up git repo with `.gitignore` → AC-1

### Phase 2: Color Engine (lib/)

- [ ] 2.1. Implement `lib/curves.ts` — lightness + chroma + hue shift curves → AC-2
- [ ] 2.2. Implement `lib/color-parser.ts` — parse HEX/OKLCH/HSL/RGB/named via culori → AC-2, AC-3
- [ ] 2.3. Implement `lib/color-formatter.ts` — format OKLCH → HEX/HSL/CSS var → AC-5
- [ ] 2.4. Implement `lib/gamut.ts` — sRGB/P3 gamut check + mapping via culori → AC-9
- [ ] 2.5. Implement `lib/contrast.ts` — APCA Lc calculation via apcach → AC-8
- [ ] 2.6. Implement `lib/color-engine.ts` — orchestrator: input → 11 PaletteShade[] → AC-2, AC-3
- [ ] 2.7. Implement `lib/utils.ts` — clipboard helper, URL encoding → AC-4, AC-6

### Phase 3: State & Hooks

- [ ] 3.1. Implement `hooks/use-palette.ts` — URL params ↔ palette state → AC-6, AC-7
- [ ] 3.2. Implement `hooks/use-color-format.ts` — format preference with localStorage → AC-5
- [ ] 3.3. Implement `hooks/use-copy.ts` — clipboard + toast feedback → AC-4, AC-E3

### Phase 4: Generator Page (Core UI)

- [ ] 4.1. Build `components/shared/contrast-badge.tsx` — APCA badge (AAA/AA/A/Fail) → AC-8
- [ ] 4.2. Build `components/shared/gamut-badge.tsx` — sRGB/P3 indicator → AC-9
- [ ] 4.3. Build `components/shared/copy-button.tsx` — 1-click copy with toast → AC-4
- [ ] 4.4. Build `components/palette/shade-card.tsx` — swatch + values + badges + copy → AC-2, AC-4, AC-8, AC-9
- [ ] 4.5. Build `components/palette/palette-grid.tsx` — responsive 11-shade grid → AC-2
- [ ] 4.6. Build `components/palette/color-input.tsx` — input field with format detection + error state → AC-2, AC-3, AC-E1
- [ ] 4.7. Build `components/palette/format-toggle.tsx` — format selector dropdown → AC-5
- [ ] 4.8. Build `components/palette/palette-header.tsx` — name + share + copy all → AC-6
- [ ] 4.9. Assemble `app/page.tsx` — generator page with all components wired → AC-1, AC-2, AC-3

### Phase 5: Palette Data

- [ ] 5.1. Create `data/tailwind-palettes.ts` — 22 Tailwind v4 palettes (official OKLCH values) → AC-10
- [ ] 5.2. Create `data/curated-palettes.ts` — 7 curated palettes (Ocean, Dune, Void, Coral, Moss, Ember, Arctic) → AC-10

### Phase 6: Catalogue Page

- [ ] 6.1. Build `components/catalogue/palette-preview.tsx` — mini stripe card → AC-10
- [ ] 6.2. Build `components/catalogue/catalogue-grid.tsx` — responsive grid of previews → AC-10
- [ ] 6.3. Build `components/catalogue/catalogue-filter.tsx` — search + source filter → AC-17
- [ ] 6.4. Assemble `app/catalogue/page.tsx` — catalogue page → AC-10, AC-11

### Phase 7: Random Page

- [ ] 7.1. Implement random palette generation logic (constrained hue + chroma) → AC-12
- [ ] 7.2. Assemble `app/random/page.tsx` — random page with shuffle + "open in generator" → AC-12, AC-13

### Phase 8: Polish & Release

- [ ] 8.1. Responsive breakpoints — test all 4 breakpoints, fix grid behavior → AC-1
- [ ] 8.2. Keyboard navigation — tab order, Enter/Space to copy, arrow keys in grid → AC-18
- [ ] 8.3. ARIA labels on shade cards, badges, interactive elements → AC-18
- [ ] 8.4. URL edge case hardening — invalid params clamping, empty state → AC-E2
- [ ] 8.5. Performance audit — tree-shake culori, lazy load catalogue data → AC-1
- [ ] 8.6. Meta tags + OG image + page titles → AC-1
- [ ] 8.7. Final `lint + typecheck + build` pass → AC-1

### Out of Scope

- Multi-palette workspace (V2)
- Tailwind config export (V2)
- Figma variables export (V2)
- Semantic color builder (V2)
- Harmony wheel (V2)
- Color blindness simulator (V2)
- Advanced lightness/chroma controls (should-have, not blocking)
- User accounts, authentication
- Backend, API, database
- Analytics integration (post-launch)

## Quality Checklist

### Blocking (must pass to ship)

- [ ] All Must Have ACs (AC-1 through AC-15) passing
- [ ] All Error Criteria ACs (AC-E1, AC-E2, AC-E3) passing
- [ ] All 8 phases implemented
- [ ] No regressions in existing tests
- [ ] Error states handled (invalid input, clipboard unavailable, out-of-gamut)
- [ ] No hardcoded secrets or credentials
- [ ] Tailwind v4 palette values match official source (verified against `theme.css`)
- [ ] `npm run lint && npm run typecheck && npm run build` passes clean
- [ ] Dark mode renders correctly (both system pref + manual toggle)
- [ ] URL sharing works (paste URL → correct palette renders)

### Advisory (should pass, not blocking)

- [ ] All Should Have ACs (AC-16, AC-17, AC-18) passing
- [ ] Lighthouse Performance ≥ 95
- [ ] Bundle size < 150KB gzipped
- [ ] All shade cards keyboard-accessible
- [ ] Responsive at all 4 breakpoints

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | not configured | will set up Vitest |
| E2E framework | not configured | will evaluate Playwright vs manual QA |
| Test DB | N/A | no database |
| Mock inventory | 0 | Clipboard API only external dependency |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | Manual | Default palette renders on load |
| AC-2 | Unit | `generatePalette('#e11d48')` returns 11 valid shades |
| AC-3 | Unit | `parseColor('oklch(0.6 0.2 259)')` returns correct OklchColor |
| AC-4 | E2E | Click shade card → clipboard contains value |
| AC-5 | Unit | `formatColor(color, 'hex')` returns correct format |
| AC-6 | E2E | Click share → clipboard contains URL with params |
| AC-7 | Unit | `usePalette` with URL params returns correct palette |
| AC-8 | Unit | `getContrastLevel(lc)` returns correct badge level |
| AC-9 | Unit | `getGamutStatus(color)` returns correct status |
| AC-10 | Manual | Catalogue shows all palettes |
| AC-11 | E2E | Click catalogue card → navigates to generator |
| AC-12 | Manual | Random page shows a palette |
| AC-13 | E2E | Click shuffle → new palette appears |
| AC-E1 | Unit | `parseColor('asdf')` returns null, UI shows error state |
| AC-E2 | Unit | Clamping logic for h > 360, c > 0.4, etc. |
| AC-E3 | E2E | Mock clipboard fail → fallback message appears |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | Unit: invalid input returns null, not crash | BLOCKING |
| Error Journey | E2 | Unit: clipboard fallback works | Advisory |
| Error Journey | E3 | Unit: extreme chroma generates valid (clamped) colors | BLOCKING |
| Edge Case | EC2 | Unit: URL params clamped to valid ranges | BLOCKING |
| Edge Case | EC4 | Unit: achromatic input (C=0) generates valid grayscale | BLOCKING |
| Edge Case | EC5 | Unit: hue wrapping at 0/360 boundary handles correctly | BLOCKING |
| Failure Hypothesis | FH-1 | Unit: culori parse handles all CSS color formats without crash | BLOCKING |
| Failure Hypothesis | FH-2 | Unit: apcach returns valid Lc for extreme L values (0, 1) | BLOCKING |

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| Clipboard API | Mock in tests | Browser API, no sandbox available |
| culori | Real | Pure computation, no I/O |
| apcach | Real | Pure computation, no I/O |
| next/navigation | Mock (useSearchParams) | Standard Next.js test pattern |

### TDD Commitment

Phase 2 (color engine) will be developed TDD: tests first for all `lib/` functions. UI phases (4-7) will be tested via E2E after assembly.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| culori tree-shaking doesn't work with Next.js bundler | HIGH — bundle bloat | LOW | Import from `culori/fn`, test bundle size early in Phase 2 |
| apcach API doesn't expose raw Lc calculation | HIGH — can't show contrast values | LOW | Verify API in Phase 2 spike; fallback: use `apca-w3` directly |
| Lyse Registry components conflict with Tailwind v4 | MED — styling issues | MED | Install early in Phase 1, test rendering before custom components |
| OKLCH values in PALETTES.md don't match rendered colors | MED — trust issue | LOW | Verify 3 random palettes against Tailwind docs in Phase 5 |
| URL state loses precision on float serialization | MED — shared palettes differ | LOW | Round to 3 decimal places in URL params |

**Kill criteria:** If Lyse Registry components fundamentally break with Next.js 15 + Tailwind v4 in Phase 1, fall back to raw shadcn/ui and Radix UI directly.

## State Machine

### URL State Lifecycle

```
┌────────┐   load /     ┌──────────┐   user types    ┌───────────┐
│  EMPTY │─────────────▶│ DEFAULT  │────────────────▶│ GENERATED │
│ (init) │              │ (blue)   │                  │ (custom)  │
└────────┘              └──────────┘                  └─────┬─────┘
                              ▲                             │
                              │          update color       │
                              └─────────────────────────────┘

URL params: ?h=259&c=0.214&l=0.65&name=blue

States:
  EMPTY:     No URL params → use defaults
  DEFAULT:   Default blue palette (h=259, c=0.214)
  GENERATED: User-provided color in URL params

Transitions:
  load / → EMPTY (if no params) or GENERATED (if params exist)
  user types color → GENERATED (URL updates)
  clear input → DEFAULT (URL resets)
  click catalogue card → GENERATED (navigate with params)
  click shuffle → GENERATED (random params)
```

### Format State

```
┌────────┐   select    ┌───────┐
│ oklch  │◀───────────▶│  hex  │
│(default│   format    │       │
└────┬───┘  toggle     └───┬───┘
     │                     │
     │    ┌───────┐        │
     └───▶│  hsl  │◀───────┘
          └───┬───┘
              │
              │    ┌────────┐
              └───▶│ cssvar │
                   └────────┘

Stored in: localStorage('color-format')
```

## Analysis

### Assumptions Challenged

| # | Assumption | Evidence For | Evidence Against | Verdict | Action |
|---|------------|-------------|-----------------|---------|--------|
| 1 | culori can parse all common CSS color formats | culori docs confirm CSS Colors L4 support | Some edge cases (color-mix, relative colors) may not be supported | VALID | → no action — we support standard formats only |
| 2 | apcach exposes Lc values directly | apcach README shows `apcachToCss()` | API may only output colors, not raw Lc numbers | RISKY | → explore — verify apcach API for raw Lc output in Phase 2; fallback: use `apca-w3` |
| 3 | Lyse Registry works with Next.js 15 App Router | Registry built on React 19 + Tailwind v4 | shadcn CLI `init` may not detect App Router correctly | RISKY | → explore — test in Phase 1 before building custom components |
| 4 | URL state is sufficient (no global store needed) | URL params cover all palette state | Format preference needs localStorage, not URL | VALID | → no action — hybrid approach (URL + localStorage) is spec'd |
| 5 | 100ms palette generation target is achievable | culori parse + convert is microseconds, 11 shades is trivial | apcach contrast calc per shade may be expensive | VALID | → no action — profile in Phase 2, 11 iterations is negligible |

### Blind Spots

1. **[Performance]** First-load bundle size with culori + apcach + Radix primitives could exceed 150KB
   Why it matters: Lighthouse score drops, mobile users suffer

2. **[UX]** No empty state design — what shows if user clears input completely?
   Why it matters: Blank screen is a bad experience

3. **[Browser]** CSS `oklch()` fallback for the 5% on older browsers
   Why it matters: Shade swatches render wrong colors if oklch unsupported

4. **[Data]** Tailwind v4 source has 26 color families (includes mauve, olive, mist, taupe) — spec says 22
   Why it matters: Users familiar with Tailwind may expect the extra families

### Failure Hypotheses

| # | IF | THEN | BECAUSE | Severity | Mitigation |
|---|-----|------|---------|----------|------------|
| FH-1 | apcach doesn't expose raw Lc values | We can't show contrast numbers on shade cards | apcach may only output "the color that meets contrast X" not "the contrast of color X" | HIGH | Verify API early; fallback: compute Lc with `apca-w3` directly |
| FH-2 | Lyse Registry CSS conflicts with custom component styles | Visual glitches in shade cards | Token layer may override custom OKLCH swatch colors | MED | Isolate swatch rendering from token system; use inline `style={{ backgroundColor }}` |
| FH-3 | URL float precision causes palette drift when sharing | Shared palette looks different from original | JavaScript float serialization loses precision | MED | Round all URL params to 3 decimal places; validate on load |

### The Real Question

Confirmed — this spec solves the right problem. The gap in the market is real: no tool combines OKLCH generation + APCA contrast + gamut mapping + instant sharing. The scope is tight (3 pages, ~40 files, pure client-side). The main risk is Phase 1 setup (Lyse Registry + Next.js 15 compatibility) — if that works, the rest is straightforward.

### Open Items

- [risk] apcach raw Lc value API → explore in Phase 2 spike
- [gap] Blind spot #4: include 4 extra Tailwind families (mauve, olive, mist, taupe) or explicitly exclude? → question user
- [improvement] Consider adding `sonner` for toasts instead of Lyse Toast (more animation control) → no action for now
- [gap] No favicon / OG image design specified → no action — generic placeholder for MVP

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| Phase 1 | Project Foundations | pending | - |
| Phase 2 | Color Engine | pending | - |
| Phase 3 | State & Hooks | pending | - |
| Phase 4 | Generator Page | pending | - |
| Phase 5 | Palette Data | pending | - |
| Phase 6 | Catalogue Page | pending | - |
| Phase 7 | Random Page | pending | - |
| Phase 8 | Polish & Release | pending | - |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-08T18:30:00Z | - | Created |
