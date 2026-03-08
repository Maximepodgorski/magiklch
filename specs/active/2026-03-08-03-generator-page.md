---
title: "OKLCH Generator — 3/5 Generator Page"
status: active
created: 2026-03-08
estimate: 5h
tier: standard
depends: 02-color-engine
---

# OKLCH Generator — 3/5 Generator Page

## Context

Build the main generator page (`/`) — the hero of the app. Wire color engine to React hooks, build all palette UI components (shade cards, grid, color input, format toggle, palette header), and shared components (copy button, gamut badge, contrast badge). User types a color → sees 11 shades with contrast + gamut info → copies values in 1 click → shares via URL.

**Spec review changes:** A11y (ARIA, keyboard, focus) is now IN this spec, not deferred to spec 5. Components ship complete. Format toggle is a segmented control (1-click), not a Select dropdown (2-click). Default format is HEX. Copy All outputs CSS custom properties. `app/page.tsx` uses Suspense boundary for useSearchParams.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `hooks/use-palette.ts` | CREATE | URL params ↔ palette state, calls generatePalette. **Wrapped in Suspense.** |
| `hooks/use-color-format.ts` | CREATE | Format preference (hex/oklch/hsl/cssvar) in localStorage. **Default: hex.** Uses mounted flag to avoid hydration mismatch. |
| `hooks/use-copy.ts` | CREATE | Clipboard write + toast feedback |
| `components/shared/copy-button.tsx` | CREATE | 1-click copy wrapper with checkmark animation |
| `components/shared/gamut-badge.tsx` | CREATE | sRGB/P3 indicator. Plain `<span>` with `aria-label` (NOT `role="status"`). |
| `components/shared/contrast-badge.tsx` | CREATE | APCA level badge (AAA/AA/A/Fail). Plain `<span>` with `aria-label`. Badge text color meets APCA Lc 60+ against card surface. |
| `components/palette/shade-card.tsx` | CREATE | `<button>` element (NOT div role="button"). Swatch + values + badges + copy. ARIA label includes step, value, contrast level, gamut. |
| `components/palette/palette-grid.tsx` | CREATE | Responsive 11-shade grid layout. `role="list"` with `role="listitem"` and roving tabindex for arrow key navigation. |
| `components/palette/color-input.tsx` | CREATE | Color input with format detection + error state. `aria-invalid` + `aria-describedby` on error. |
| `components/palette/format-toggle.tsx` | CREATE | **Segmented control / tab strip** (HEX / OKLCH / HSL / var) — 1-click switch. NOT a Select dropdown. |
| `components/palette/palette-header.tsx` | CREATE | Palette name + Share + **Copy All (CSS custom properties in selected format)** |
| `app/page.tsx` | MODIFY | Replace placeholder. **Wrap in `<Suspense fallback={<PaletteSkeleton />}>`.** |
| `lib/color-engine.ts` | AFFECTED | Consumed by use-palette hook |
| `types/color.ts` | AFFECTED | Consumed by all components |
| `components/ui/` | AFFECTED | Badge, Button, Input, Toast, Tooltip consumed |

**Files:** 11 create | 1 modify | ~15 affected
**Reuse:** Lyse Badge (contrast + gamut), Lyse Button (copy, share), Lyse Input (color input), Lyse Toast (copy feedback), Lyse Tooltip (shade hover)
**Breaking changes:** None
**New dependencies:** None

## User Journey (MANDATORY)

### Primary Journey — Generate & Copy

ACTOR: Design engineer
GOAL: Generate an OKLCH palette from a base color and copy values
PRECONDITION: App running with color engine (specs 1+2)

1. User loads `/`
   → System reads URL params (or uses default blue #3b82f6) inside Suspense boundary
   → User sees 11 shade cards in responsive grid with swatches, values, badges

2. User types `#e11d48` in color input
   → System debounces (300ms), parses input, updates URL params
   → User sees palette regenerate with rose/red shades

3. User clicks shade 500 card (a `<button>`)
   → System copies hex value to clipboard
   → User sees toast "Copied #e11d48" (auto-dismiss 2s)
   → Visually-hidden aria-live region announces the copy

4. User clicks "OKLCH" in the segmented format toggle (1 click)
   → System updates all shade cards to OKLCH format
   → User sees `oklch(...)` values on all cards

5. User clicks [Copy All]
   → System copies all 11 shades as CSS custom properties in selected format
   → User sees toast "Copied 11 color values"

6. User clicks [Share]
   → System copies current URL to clipboard
   → User sees toast "Link copied to clipboard"

POSTCONDITION: User has copied values, URL is shareable

### Primary Journey — Keyboard Navigation

ACTOR: Keyboard user
GOAL: Navigate the generator page using keyboard only
PRECONDITION: Generator page loaded

1. User presses Tab
   → Focus moves through: color input → format toggle → share → copy all → shade cards (first)
   → User sees visible focus rings on each element

2. User focuses a shade card and presses Enter or Space
   → System copies the shade value to clipboard
   → aria-live region announces "Copied {value}"

3. User presses Arrow Right on a shade card
   → Focus moves to next shade via roving tabindex
   → User navigates between shades without Tab

POSTCONDITION: All functionality accessible via keyboard

### Error Journeys

E1. Invalid color input
   Trigger: User types `asdf` in color input
   1. User types invalid string
      → Input gets `aria-invalid="true"` + red border
      → Error message linked via `aria-describedby`: "Invalid color format"
      → Previous valid palette remains visible (no blank state)
   2. User corrects to `#3b82f6`
      → System removes error, generates new palette
   Recovery: Last valid palette always stays

E2. Clipboard unavailable
   Trigger: Browser doesn't support Clipboard API
   1. User clicks copy button
      → System detects clipboard unavailable
      → User sees toast "Copy not supported — select and copy manually"
   Recovery: Values are still visible, user can select+copy manually

### Edge Cases

EC1. Empty input after clearing: Show default blue palette (not blank)
EC2. URL with partial params (`?h=259` only): Use defaults for missing params (c=0.214, l=0.65)
EC3. Very long palette name: Truncate in header, full name in tooltip
EC4. Rapid typing: Debounce input → only generate after 300ms pause
EC5. Mobile tap on shade card: Same as click — copy value (shade card is a `<button>`, works natively)
EC6. Hydration mismatch from localStorage format: useColorFormat returns null until mounted, renders default on server

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN `/` page WHEN loaded with no URL params THEN default blue palette (11 shades) is displayed inside a Suspense boundary
- [ ] AC-2: GIVEN color input WHEN user types valid HEX `#e11d48` THEN palette regenerates within 100ms (after 300ms debounce) with correct shades
- [ ] AC-3: GIVEN color input WHEN user types valid OKLCH `oklch(0.6 0.2 259)` THEN palette generates correctly
- [ ] AC-4: GIVEN a shade card (`<button>`) WHEN user clicks it THEN selected-format value is copied to clipboard AND toast confirms "Copied {value}"
- [ ] AC-5: GIVEN format toggle (segmented control) WHEN user clicks HEX/OKLCH/HSL/var segment THEN all shade cards update to display selected format (1 click, no dropdown)
- [ ] AC-6: GIVEN palette header WHEN user clicks Share THEN current URL (with palette params) is copied AND toast shows "Link copied"
- [ ] AC-7: GIVEN URL `/?h=259&c=0.214&l=0.65&name=blue` WHEN loaded THEN correct palette with name "blue" is displayed
- [ ] AC-8: GIVEN each shade card WHEN rendered THEN shows APCA contrast badge with Lc values for on-white and on-black, badge text meets APCA Lc 60+ against card surface
- [ ] AC-9: GIVEN each shade card WHEN shade is outside sRGB THEN P3 badge is visible
- [ ] AC-10: GIVEN palette grid WHEN viewport is xl (≥1280px) THEN all 11 shades display in single row
- [ ] AC-11: GIVEN palette grid WHEN viewport is sm (<640px) THEN shades display in 2-column grid
- [ ] AC-12: GIVEN palette header WHEN user clicks Copy All THEN all 11 shades copied as CSS custom properties (`:root { --color-{name}-50: {value}; ... }`) in the currently selected format
- [ ] AC-13: GIVEN any interactive element WHEN focused via Tab THEN visible focus ring is displayed
- [ ] AC-14: GIVEN a shade card WHEN focused and user presses Enter or Space THEN shade value is copied to clipboard
- [ ] AC-15: GIVEN shade grid (`role="list"`) WHEN user presses Arrow Left/Right THEN focus moves between adjacent shades via roving tabindex
- [ ] AC-16: GIVEN all shade cards WHEN inspected THEN each has `aria-label` describing: shade step, color value (in selected format), contrast level, gamut status
- [ ] AC-17: GIVEN color input WHEN in error state THEN has `aria-invalid="true"` AND error message linked via `aria-describedby`
- [ ] AC-18: GIVEN palette regeneration WHEN new palette renders THEN visually-hidden `aria-live="polite"` region announces "Palette updated: {name}"

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN color input WHEN user types invalid string THEN input shows `aria-invalid="true"` + red border + error message AND previous palette stays visible
- [ ] AC-E2: GIVEN clipboard API unavailable WHEN user clicks copy THEN fallback toast message appears (no crash)
- [ ] AC-E3: GIVEN URL with invalid params (`?h=999&c=5`) WHEN loaded THEN values are clamped to valid ranges

### Should Have

- [ ] AC-19: GIVEN a shade card WHEN hovered THEN tooltip shows full OKLCH breakdown
- [ ] AC-20: GIVEN copy button WHEN clicked THEN shows checkmark animation (300ms), respects `prefers-reduced-motion`
- [ ] AC-21: GIVEN color input WHEN typing rapidly THEN generation is debounced at 300ms (no jank)
- [ ] AC-22: GIVEN the format default WHEN app loads for first time THEN format is HEX (not OKLCH)

## Scope

- [ ] 1. Implement `hooks/use-palette.ts` — read URL search params via `useSearchParams` (inside Suspense), generate palette, provide update functions. Debounce URL writes at 300ms. → AC-1, AC-7, AC-E3
- [ ] 2. Implement `hooks/use-color-format.ts` — format state in localStorage, **default: 'hex'**, mounted flag to prevent hydration mismatch → AC-5, AC-22
- [ ] 3. Implement `hooks/use-copy.ts` — clipboard write with success/error feedback + aria-live announcement → AC-4, AC-E2
- [ ] 4. Build `components/shared/contrast-badge.tsx` — APCA level badge as `<span>` with `aria-label` (no `role="status"`), badge text Lc 60+ → AC-8
- [ ] 5. Build `components/shared/gamut-badge.tsx` — sRGB/P3 indicator as `<span>` with `aria-label` (no `role="status"`) → AC-9
- [ ] 6. Build `components/shared/copy-button.tsx` — 1-click copy with toast + checkmark (respects `prefers-reduced-motion`) → AC-4, AC-20
- [ ] 7. Build `components/palette/shade-card.tsx` — **`<button>` element** (not div), swatch via inline `style={{ backgroundColor }}` + `forced-color-adjust: none`, values + badges + copy, ARIA label with step + value + contrast + gamut → AC-4, AC-8, AC-9, AC-14, AC-16, AC-19
- [ ] 8. Build `components/palette/palette-grid.tsx` — responsive grid, `role="list"` + `role="listitem"`, roving tabindex for arrow key navigation → AC-10, AC-11, AC-15
- [ ] 9. Build `components/palette/color-input.tsx` — input with format detection + validation + `aria-invalid` + `aria-describedby` error → AC-2, AC-3, AC-E1, AC-17, AC-21
- [ ] 10. Build `components/palette/format-toggle.tsx` — **segmented control (4 tabs: HEX / OKLCH / HSL / var)**, NOT Select dropdown → AC-5
- [ ] 11. Build `components/palette/palette-header.tsx` — name + Share + Copy All (CSS custom properties in selected format) + one-line descriptor: "Generate OKLCH palettes with APCA contrast" → AC-6, AC-12
- [ ] 12. Add visually-hidden `aria-live="polite"` region for palette change announcements → AC-18
- [ ] 13. Assemble `app/page.tsx` — wrap in `<Suspense fallback={<PaletteSkeleton />}>`, wire all components → AC-1, AC-2, AC-3, AC-7, AC-13

### Out of Scope

- Catalogue page (spec 4)
- Random page (spec 5)
- Advanced controls (lightness curve, chroma scaling sliders)
- Palette data files (spec 4)

## Quality Checklist

### Blocking

- [ ] All Must Have ACs (AC-1 through AC-18) passing
- [ ] All Error Criteria (AC-E1, AC-E2, AC-E3) passing
- [ ] Shade cards are `<button>` elements (not div with role)
- [ ] All shade cards have complete aria-labels
- [ ] Color input error state uses `aria-invalid` + `aria-describedby`
- [ ] No `role="status"` on static badges
- [ ] Palette change announced via aria-live
- [ ] Shade swatch colors use inline `style` + `forced-color-adjust: none`
- [ ] URL sharing roundtrip works (copy URL → paste in new tab → same palette)
- [ ] Copy-to-clipboard works on Chrome + Safari + Firefox
- [ ] `npm run lint && npm run typecheck && npm run build` clean

### Advisory

- [ ] AC-19 through AC-22 passing
- [ ] Responsive at all 4 breakpoints (sm/md/lg/xl)
- [ ] Dark mode renders correctly on all components
- [ ] Badge text color meets APCA Lc 60+ against card surface

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | configured (spec 2) | Vitest |
| E2E framework | not configured | Evaluate Playwright at this stage |
| Test DB | N/A | |
| Mock inventory | 2 | Clipboard API, next/navigation (useSearchParams) |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | E2E | Page loads with default blue palette inside Suspense |
| AC-2 | E2E | Type hex → palette updates after debounce |
| AC-4 | E2E | Click shade card button → clipboard has value |
| AC-5 | E2E | Click format segment → cards update |
| AC-6 | E2E | Click share → clipboard has URL |
| AC-7 | Unit | usePalette with URL params → correct palette |
| AC-12 | E2E | Copy All → clipboard has CSS custom properties |
| AC-14 | E2E | Enter/Space on shade card → copies value |
| AC-15 | E2E | Arrow keys navigate shade grid |
| AC-16 | Unit | All shade cards have complete aria-label |
| AC-17 | Unit | Error input has aria-invalid + aria-describedby |
| AC-E1 | E2E | Invalid input → aria-invalid + error UI + palette preserved |
| AC-E2 | E2E | Mock clipboard fail → fallback toast |
| AC-E3 | Unit | Invalid URL params → clamped values |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | E2E: invalid input shows aria-invalid, palette stays | BLOCKING |
| Error Journey | E2 | E2E: clipboard fail shows fallback message | BLOCKING |
| Edge Case | EC1 | E2E: cleared input shows default palette | BLOCKING |
| Edge Case | EC2 | Unit: partial URL params use defaults | BLOCKING |
| Edge Case | EC6 | Unit: useColorFormat returns null before mount (no hydration mismatch) | BLOCKING |
| Spec Review | SR-1 | E2E: Suspense boundary renders skeleton on slow load | Advisory |
| Spec Review | SR-2 | Unit: Copy All outputs valid CSS custom properties | BLOCKING |

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| Clipboard API | Mock in tests | Browser API, not available in Node |
| next/navigation | Mock useSearchParams, useRouter | Standard Next.js test pattern |
| culori | Real | Pure computation |
| apca-w3 | Real | Pure computation |

### TDD Commitment

Hooks tested unit-style (TDD). Components tested E2E after assembly. Every AC mapped to at least one test.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| useSearchParams without Suspense causes build error | HIGH | CERTAIN | **Mandatory Suspense boundary** in app/page.tsx (AC-1) |
| Hydration mismatch from localStorage format read | HIGH | HIGH | useColorFormat uses mounted flag; renders default on server, real value after mount |
| Shade card re-renders on every keystroke | MED | MED | Debounce input at 300ms (not 150ms), memoize palette generation |
| Toast stacking on rapid copies | LOW | MED | Use toast queue with max 1 visible |
| Badge text color fails APCA against card surface | MED | MED | Validate badge foreground meets Lc 60+ in both themes |

**Kill criteria:** If useSearchParams + URL-first state causes persistent hydration issues after 1h debugging, fall back to client-side state + URL sync on blur.

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
Suspense boundary wraps the entire generator shell.
```

### Format State

```
┌────────┐   click segment   ┌───────┐
│  hex   │◀─────────────────▶│ oklch │
│(default)│                   │       │
└────┬───┘                   └───┬───┘
     │        ┌───────┐         │
     └───────▶│  hsl  │◀────────┘
              └───┬───┘
                  │    ┌────────┐
                  └───▶│ cssvar │
                       └────────┘
Stored in: localStorage('color-format')
Default: 'hex' (most universally pasteable)
Hydration: null until mounted, then read localStorage
```

## Analysis

### Assumptions Challenged

| # | Assumption | Evidence For | Evidence Against | Verdict | Action |
|---|------------|-------------|-----------------|---------|--------|
| 1 | useSearchParams works with Suspense for real-time URL sync | Next.js 15 docs mandate Suspense | Every router.replace triggers re-render of Suspense subtree | VALID with mitigation | → debounce 300ms + useMemo on palette |
| 2 | Clipboard API works on all modern browsers | 95%+ support | Safari requires user gesture | VALID | → use-copy handles with fallback |
| 3 | Segmented control is better UX than Select for format | 1-click vs 2-click for high-frequency action | Takes more horizontal space | VALID | → 4 segments fit easily |
| 4 | `<button>` for shade cards is correct | Native keyboard + AT support for free | Button may need CSS reset | VALID | → much better than div role="button" |

### Blind Spots

1. **[UX]** Copy All format = CSS custom properties — defined and resolved.
2. **[A11y]** Badge colors (green=AAA, yellow=AA, orange=A, red=Fail) — text labels always visible, not truncated. Colorblind users read the text.
3. **[Mobile]** No hover on mobile — tooltip on shade card requires tap-to-expand or is omitted on mobile (Should Have, not blocking).

### Failure Hypotheses

| # | IF | THEN | BECAUSE | Severity | Mitigation |
|---|-----|------|---------|----------|------------|
| FH-1 | Suspense boundary not set up correctly | Build fails or route becomes fully dynamic | Next.js 15 strict enforcement | HIGH | AC-1 explicitly requires Suspense; test immediately |
| FH-2 | Swatch inline styles overridden in Forced Colors Mode | All swatches appear identical | Windows High Contrast overrides backgrounds | MED | `forced-color-adjust: none` on swatch elements |
| FH-3 | Rapid sequential copies (11 values) show no feedback after first toast | User unsure if copy worked | Toast max 1 visible, copies 2-11 have no confirmation | MED | Show inline checkmark on card itself (persistent, not toast-based) |

### The Real Question

This is the core product. Format default=HEX, Copy All=CSS custom properties, segmented toggle=1-click — these decisions from spec review make the hero path (type color → copy CSS) take <10 seconds. A11y is now built-in, not bolted-on.

### Open Items

- [resolved] Copy All format = CSS custom properties in selected format
- [resolved] Default format = HEX
- [resolved] Format toggle = segmented control
- [resolved] A11y in spec 3, not deferred to spec 5

**Spec review applied: 2026-03-08** — Suspense boundary, a11y in-spec, segmented toggle, HEX default, Copy All defined, button for shade cards, aria-invalid on input, no role="status" on badges, aria-live for palette change, forced-color-adjust, 300ms debounce.

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | hooks/use-palette.ts (Suspense) | pending | - |
| 2 | hooks/use-color-format.ts (HEX default) | pending | - |
| 3 | hooks/use-copy.ts | pending | - |
| 4 | contrast-badge (no role=status) | pending | - |
| 5 | gamut-badge (no role=status) | pending | - |
| 6 | copy-button (reduced-motion) | pending | - |
| 7 | shade-card (button, ARIA) | pending | - |
| 8 | palette-grid (role=list, roving tabindex) | pending | - |
| 9 | color-input (aria-invalid) | pending | - |
| 10 | format-toggle (segmented) | pending | - |
| 11 | palette-header (Copy All CSS vars) | pending | - |
| 12 | aria-live region | pending | - |
| 13 | app/page.tsx (Suspense) | pending | - |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-08T19:00:00Z | - | Created |
| spec-review | 2026-03-08T20:00:00Z | - | Merged: Suspense, a11y, segmented toggle, HEX default, Copy All, button cards |
