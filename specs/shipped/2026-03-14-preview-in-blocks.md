---
title: Preview in Blocks
status: shipped
shipped: 2026-03-14
created: 2026-03-14
estimate: 1.5h
tier: mini
---

# Preview in Blocks

## Prerequisites

- `/blocks` route exists with auth/settings/pricing templates and live palette theming (SHIPPED in v1.1)
- `brandScopeCss()` and `neutralScopeCss()` operational with 3-layer token system

## Context

Designer generates a custom palette in Generator but can't see how it looks on real UI components. The Blocks page already renders auth/settings/pricing templates with live palette theming, but only supports pre-built palettes (Tailwind). Adding a "Preview in Blocks" CTA bridges the two — Generator stays the lab, Blocks becomes the mirror.

## Codebase Impact

| Area | Impact | Detail |
|------|--------|--------|
| `components/palette/generator-shell.tsx` | MODIFY | Add "Preview in Blocks" CTA button (opens new tab) |
| `components/blocks/blocks-shell.tsx` | MODIFY | Support `brand=custom` mode with `h`/`c` params → generatePalette() → hex array (filter step 975) |
| `components/blocks/blocks-toolbar.tsx` | MODIFY | Handle `brand=custom` state: show "Your palette" indicator, hide brand Select |
| `lib/color-engine.ts` | AFFECTED | Already exports `generatePalette()` — consumed by blocks-shell in custom mode |

**Files:** 0 create | 3 modify | 1 affected
**Reuse:** `generatePalette()` from color-engine, `brandScopeCss()` from palette-theme, `usePalette()` hook state
**Breaking changes:** None — existing `/blocks?brand=blue` URLs continue to work
**New dependencies:** None

## User Journey

ACTOR: Designer using Generator
GOAL: See current custom palette rendered on realistic UI components
PRECONDITION: User has a palette loaded in Generator (h/c/l params in URL)

1. User tweaks palette in Generator (adjusts hue, chroma via sliders)
   → System updates palette swatches in real-time
   → User sees 11 shade strip

2. User clicks "Preview in Blocks" CTA
   → System builds URL: `/blocks?brand=custom&h={h}&c={c}`
   → **Browser opens Blocks page in a new tab** (preserves Generator state for iteration)
   → User sees auth/settings/pricing templates themed with their custom palette

3. User iterates: Alt-Tab back to Generator, tweak, click CTA again
   → New tab opens with updated palette
   → No flow disruption — Generator is never navigated away from

4. User can switch between block tabs (Login, Preferences, Pricing)
   → Each block renders with the custom brand palette
   → Neutral palette remains independently selectable via dropdown

5. On Blocks page in custom mode:
   → Brand dropdown is replaced by a "Your palette" read-only indicator with generated color dots
   → User can click a preset brand to exit custom mode (AC-4)

Error: E1. Invalid or missing h/c params
   Trigger: User manually edits URL with bad values or navigates to `/blocks?brand=custom` without h/c
   → System falls back to default brand ("blue") via `getStripeHex("blue")`
   Recovery: Blocks renders normally with blue palette

### Edge Cases

EC1. User switches brand dropdown while in custom mode → overrides custom with selected preset, h/c params cleared
EC2. Lightness (l) is intentionally NOT passed — engine uses SHADE_LIGHTNESS curve (l is always discarded). This is by design.
EC3. `generatePalette()` returns 12 shades (steps 50–975). `brandScopeCss()` expects 11 (suffixes 050–950). Step 975 must be filtered before passing hex array.

## Acceptance Criteria

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN user is on Generator with a palette WHEN they click "Preview in Blocks" THEN a new tab opens at `/blocks?brand=custom&h={h}&c={c}`
- [ ] AC-2: GIVEN Blocks page with `brand=custom&h=259&c=0.214` WHEN page renders THEN auth/settings/pricing blocks use the generated palette colors (not default blue)
- [ ] AC-3: GIVEN Blocks page in custom mode WHEN user changes neutral dropdown THEN neutral palette updates independently (custom brand preserved)
- [ ] AC-5: GIVEN Blocks page with `brand=custom` WHEN toolbar renders THEN brand Select is replaced by a "Your palette" indicator (no broken empty Select)

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN `brand=custom` with missing/invalid h or c WHEN page loads THEN blocks fall back to default blue palette without errors

### Should Have

- [ ] AC-4: GIVEN Blocks page in custom mode WHEN user selects a preset from brand dropdown THEN custom mode is replaced by the preset and h/c params are cleared from URL

## Scope

- [ ] 1. Add "Preview in Blocks" CTA to generator-shell (target="_blank") → AC-1
- [ ] 2. Support `brand=custom` mode in blocks-shell with generatePalette() bridge (filter step 975) → AC-2, AC-3, AC-E1
- [ ] 3. Handle custom mode in blocks-toolbar: show "Your palette" indicator instead of brand Select → AC-5
- [ ] 4. Handle dropdown override of custom mode (clear h/c from URL) → AC-4

### Out of Scope

- Inline palette editing (sliders) inside Blocks — Generator handles this
- Custom neutral palettes — only brand is bridged
- Persisting custom palettes to a library/storage
- Passing lightness (l) param — intentionally reset to 0.65 by design

## Quality Checklist

- [ ] All ACs passing
- [ ] No regressions (existing `/blocks?brand=blue` URLs work)
- [ ] Error states handled (bad h/c params → fallback to blue)
- [ ] Toolbar renders cleanly in both custom and preset modes
- [ ] Shade 975 filtered before passing to brandScopeCss
- [ ] Typecheck + existing tests pass

## Test Strategy

Runner: vitest | E2E: none | TDD: RED → GREEN per AC
AC-1 → Manual (new tab navigation) | AC-2 → Unit test (generatePalette hex filtered to 11 values, fed to brandScopeCss) | AC-5 → Manual (toolbar visual) | AC-E1 → Unit test (fallback on bad params)
Mocks: none — all pure functions

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| `generatePalette()` hex = same quality as `stripeHex` | Both produce sRGB-safe hex via same gamut clamp | None | VALID |
| Only h/c needed (l discarded by engine) | CLAUDE.md: "Input lightness is always discarded — SHADE_LIGHTNESS curve determines L" | If user moved L slider, preview differs — but this is correct behavior (L is cosmetic in Generator, engine ignores it) | VALID — documented as intentional |
| "Preview in Blocks" label is clear | Standard action pattern | First-time users may not know Blocks | RISKY — low cost to rename later |
| Same-tab navigation is acceptable | Simple | Breaks iteration loop — 4 clicks per cycle, feature abandoned after first use | WRONG — fixed: new tab |
| Brand dropdown works with `value="custom"` | Seems simple | BRAND_PALETTES has no "custom" entry, Radix Select renders blank, PaletteDots returns [] | WRONG — fixed: show indicator, hide Select |
| `.shades.map(s => s.hex)` produces 11 values | Looks right | SHADE_STEPS has 12 entries (includes 975), BRAND_SUFFIXES has 11 | WRONG — fixed: filter step 975 |

### Blind Spots

1. **[Iteration loop]** Same-tab navigation destroyed creative flow — FIXED: new tab via `target="_blank"`
2. **[Toolbar state]** Brand Select showed blank/broken on custom mode — FIXED: "Your palette" indicator replaces Select
3. **[Data mismatch]** 12 shades vs 11 suffixes — FIXED: filter step 975 before passing to brandScopeCss

### Failure Hypotheses

| IF | THEN | BECAUSE | Severity | Mitigation |
|----|------|---------|----------|------------|
| User lands on Blocks with `brand=custom` and toolbar shows empty Select | User thinks UI is broken, clicks away | No matching SelectItem in BRAND_PALETTES | HIGH | Show "Your palette" indicator instead of Select |
| 12 hex values passed to brandScopeCss | Step 975 silently dropped, mapping shifts | SHADE_STEPS=12 vs BRAND_SUFFIXES=11 | LOW | Filter step 975 explicitly |
| User with desaturated palette (c≈0) previews in Blocks | Brand colors indistinguishable from neutral | Chroma near 0 | LOW | User intent — no mitigation |

### The Real Question

Confirmed — this bridges Generator → Blocks without duplicating editing UI. The spec-review caught 3 critical gaps (iteration loop, toolbar breakage, data mismatch) that are now addressed. The solution is minimal wiring with correct UX.

### Open Items

None — all blockers resolved.

## Notes

Spec review applied: 2026-03-14. Fixed: new-tab CTA, custom toolbar indicator, shade 975 filter.

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | CTA in generator-shell | [x] | 1 |
| 2 | brand=custom in blocks-shell | [x] | 1 |
| 3 | Custom toolbar indicator | [x] | 1 |
| 4 | Preset override clears custom | [x] | 1 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-14T15:15:00 | - | Created |
| spec-review | 2026-03-14T15:30:00 | - | 3 perspectives (UX Designer, Frontend Engineer, Skeptic). 3 blockers found + fixed. |
| ship | 2026-03-14T18:25:00 | ~10min | All 4 scope items, 130 tests pass, typecheck + build clean |
