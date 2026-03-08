---
title: "OKLCH Generator — 2/5 Color Engine"
status: active
created: 2026-03-08
estimate: 3h
tier: standard
depends: 01-foundations
---

# OKLCH Generator — 2/5 Color Engine

## Context

Build the pure-function color engine in `lib/`. This is the computational core: parse any CSS color → generate 11 OKLCH shades → format to any output → check gamut → calculate APCA contrast. All functions are pure (no I/O, no DOM, no state) — ideal for TDD. Every subsequent spec depends on this engine.

**Decision (from spec review):** Use `apca-w3` (not `apcach`) for APCA contrast measurement. apcach is generation-only (creates a color with target Lc). `apca-w3` measures Lc of existing colors via `calcAPCA(foreground, background)`. This is not a spike — it's decided.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `lib/curves.ts` | CREATE | Lightness curve, chroma multiplier curve, hue shift function |
| `lib/color-parser.ts` | CREATE | Parse HEX/OKLCH/HSL/RGB/named colors via culori → OklchColor |
| `lib/color-formatter.ts` | CREATE | Format OklchColor → HEX, HSL, CSS oklch(), CSS var string |
| `lib/gamut.ts` | CREATE | sRGB/P3 gamut check + mapping via culori `displayable` + `toGamut` |
| `lib/contrast.ts` | CREATE | APCA Lc calculation via `apca-w3` `calcAPCA()`, contrast level badges |
| `lib/color-engine.ts` | CREATE | Orchestrator: OklchColor → PaletteShade[11] (calls all above) |
| `lib/utils.ts` | CREATE | Clipboard helper, URL param encoding/decoding, clamping utils |
| `types/color.ts` | AFFECTED | Interfaces consumed by all lib/ files (created in spec 1) |

**Files:** 7 create | 0 modify | 1 affected
**Reuse:** culori/fn (parse, converter, formatHex, formatCss, displayable, toGamut), apca-w3 (calcAPCA)
**Breaking changes:** None
**New dependencies:** None (culori + apca-w3 installed in spec 1)

## User Journey (MANDATORY)

### Primary Journey

ACTOR: Developer (self)
GOAL: Call `generatePalette('#3b82f6')` and get 11 fully computed PaletteShade objects
PRECONDITION: Spec 1 complete, types available

1. Developer imports `generatePalette` from `lib/color-engine`
   → Function accepts any CSS color string
   → Returns Palette object with 11 shades

2. Developer inspects a shade (e.g., shade 500)
   → Shade contains: oklch values, hex, hsl, cssOklch, cssVar, gamut status, APCA contrast (onWhite, onBlack, level)

3. Developer calls `parseColor('oklch(0.6 0.2 259)')` directly
   → Returns OklchColor { l: 0.6, c: 0.2, h: 259 }

4. Developer calls `formatColor(color, 'hex')`
   → Returns `#3b82f6`

POSTCONDITION: All lib/ functions work, tests pass, engine generates correct palettes

### Error Journeys

E1. Invalid color input
   Trigger: `parseColor('not-a-color')` called
   1. Function receives unparseable string → culori.parse returns undefined
   2. Function returns `null` (not throw)
   Recovery: Caller checks for null and handles gracefully

E2. Extreme chroma input
   Trigger: `generatePalette` with chroma > 0.4
   1. Engine generates shades → some are out of sRGB and P3 gamut
   2. Gamut check flags them → `gamut: 'out'`
   3. Gamut-mapped fallback values are still computed
   Recovery: All shades always have valid hex/hsl values (gamut-mapped)

### Edge Cases

EC1. Achromatic input (C=0): culori returns `h: NaN` for grays. **Guard: if `h` is NaN, set `h=0` and skip hue shift.** All chroma multipliers produce 0 → valid grayscale palette.
EC2. Hue wrapping: Base hue 355° + shift of +8° → 363° → normalized to 3°
EC3. Lightness extremes: L=0 (black) or L=1 (white) → palette still generates (compressed range)
EC4. Named colors: `parseColor('rebeccapurple')` → valid OklchColor
EC5. OKLCH CSS syntax: `parseColor('oklch(62.3% 0.214 259)')` → handles % lightness (culori normalizes 62.3% → 0.623)

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN `parseColor('#3b82f6')` WHEN called THEN returns OklchColor with correct l, c, h values (within 0.01 tolerance)
- [ ] AC-2: GIVEN `parseColor('oklch(0.6 0.2 259)')` WHEN called THEN returns `{ l: 0.6, c: 0.2, h: 259 }`
- [ ] AC-3: GIVEN `parseColor('hsl(220, 90%, 60%)')` WHEN called THEN returns valid OklchColor
- [ ] AC-4: GIVEN `parseColor('invalid')` WHEN called THEN returns `null` (no throw)
- [ ] AC-5: GIVEN `generatePalette({ l: 0.623, c: 0.214, h: 259 }, 'blue')` WHEN called THEN returns Palette with exactly 11 shades at steps [50,100,200,300,400,500,600,700,800,900,950]
- [ ] AC-6: GIVEN a generated palette WHEN inspecting shade lightness values THEN each shade's L matches SHADE_LIGHTNESS curve (shade 50 ≈ 0.975, shade 950 ≈ 0.270). **Note:** L is always set by the curve, not the input L.
- [ ] AC-7: GIVEN a generated palette WHEN inspecting shade 500 THEN chroma equals base chroma × 1.00 (full input chroma). **Note:** input L is discarded; only hue and chroma from the input are used.
- [ ] AC-8: GIVEN `formatColor(color, 'hex')` WHEN called THEN returns valid hex string (e.g., `#3b82f6`)
- [ ] AC-9: GIVEN `formatColor(color, 'oklch')` WHEN called THEN returns valid CSS oklch string (e.g., `oklch(0.623 0.214 259)`)
- [ ] AC-10: GIVEN `getGamutStatus({ l: 0.7, c: 0.35, h: 150 })` WHEN called THEN returns `'p3'` or `'out'` (not `'srgb'`). **Gamut check must be done on OKLCH values before conversion.**
- [ ] AC-11: GIVEN `getGamutStatus({ l: 0.5, c: 0.1, h: 259 })` WHEN called THEN returns `'srgb'`
- [ ] AC-12: GIVEN any shade in a generated palette WHEN accessing `shade.hex` THEN hex value is always valid sRGB (gamut-mapped if needed)
- [ ] AC-13: GIVEN each shade WHEN APCA contrast is calculated via `apca-w3` `calcAPCA()` THEN `contrast.onWhite` and `contrast.onBlack` are `Math.abs()` of raw Lc values, stored as positive numbers in range 0-108. **Raw APCA Lc is signed: positive for dark-on-light, negative for light-on-dark. Always store absolute values.**
- [ ] AC-14: GIVEN `getContrastLevel(90)` WHEN called THEN returns `'AAA'`
- [ ] AC-15: GIVEN `getContrastLevel(60)` WHEN called THEN returns `'AA'`
- [ ] AC-16: GIVEN culori imports in all lib/ files WHEN inspected THEN ALL use `culori/fn` (enforced by tsconfig path alias). No `import from 'culori'` (default entry) anywhere.

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN `parseColor(null)` or `parseColor(undefined)` WHEN called THEN returns `null` without throwing
- [ ] AC-E2: GIVEN `generatePalette` with chroma 0.4 (maximum) WHEN called THEN all shades have valid hex values (no NaN, no undefined)
- [ ] AC-E3: GIVEN `generatePalette` with hue 0 WHEN called THEN hue wrapping works correctly (no negative hues, no hue > 360)
- [ ] AC-E4: GIVEN `generatePalette` with achromatic input (C=0, H=NaN) WHEN called THEN returns valid grayscale palette (H normalized to 0, no NaN in output)

### Should Have

- [ ] AC-17: GIVEN `formatColor(color, 'cssvar')` WHEN called with name 'blue' and step 500 THEN returns `--color-blue-500`

## Scope

- [ ] 1. Implement `lib/curves.ts` — SHADE_LIGHTNESS map, CHROMA_MULTIPLIER map, getHueShift function. **Verify hue shift sign for cool hues (H>180): light shades should shift slightly toward purple for blue, not toward cyan.** Compare against Tailwind blue/indigo reference. → AC-6, AC-7
- [ ] 2. Implement `lib/color-parser.ts` — parseColor() supporting HEX/OKLCH/HSL/RGB/named via culori/fn. **Add NaN hue guard: if parsed h is NaN, normalize to 0.** → AC-1, AC-2, AC-3, AC-4, AC-E1, AC-E4
- [ ] 3. Implement `lib/color-formatter.ts` — formatColor() for hex/oklch/hsl/cssvar output → AC-8, AC-9, AC-17
- [ ] 4. Implement `lib/gamut.ts` — getGamutStatus(), mapToSrgb() via culori/fn. **Check gamut on original OKLCH values, not post-conversion.** Verify `displayable(color, 'p3')` API signature against culori docs. → AC-10, AC-11, AC-12
- [ ] 5. Implement `lib/contrast.ts` — use `apca-w3` `calcAPCA(foreground, background)` for raw Lc. **Store `Math.abs(lc)` in shade data.** getContrastLevel() operates on absolute values. → AC-13, AC-14, AC-15
- [ ] 6. Implement `lib/color-engine.ts` — generatePalette() orchestrator. **Apply gamut cap after chroma multiplier (clamp to displayable before storing).** → AC-5, AC-6, AC-7, AC-12, AC-E2, AC-E3, AC-E4
- [ ] 7. Implement `lib/utils.ts` — clamp(), normalizeHue(), clipboard helper, URL encode/decode → AC-E3
- [ ] 8. Set up Vitest + write unit tests for all lib/ functions (TDD) → all ACs
- [ ] 9. Verify culori/fn tree-shaking: all imports use `culori/fn`, tsconfig alias enforced → AC-16

### Out of Scope

- React hooks (spec 3)
- UI components (spec 3)
- Palette data files (spec 4)
- Pages (specs 3-5)

## Quality Checklist

### Blocking

- [ ] All Must Have ACs (AC-1 through AC-16) passing
- [ ] All Error Criteria (AC-E1 through AC-E4) passing
- [ ] All lib/ functions are pure (no side effects, no DOM)
- [ ] All functions handle edge cases without throwing
- [ ] NaN hue guard active on achromatic inputs
- [ ] APCA Lc values stored as Math.abs() (no signed values in PaletteShade)
- [ ] All culori imports use `culori/fn` (zero default imports)
- [ ] Vitest unit tests cover every AC
- [ ] `npm run lint && npm run typecheck && npm run build` clean

### Advisory

- [ ] AC-17 passing
- [ ] 100% branch coverage on color-parser.ts
- [ ] generatePalette executes in < 10ms (11 shades)
- [ ] Hue shift visually validated for blue (H≈259) and red (H≈25) against Tailwind reference

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | to configure | Vitest (install + configure in this spec) |
| E2E framework | N/A | Pure functions only — unit tests sufficient |
| Test DB | N/A | No database |
| Mock inventory | 0 | No mocks needed — culori + apca-w3 are real |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | Unit | parseColor('#3b82f6') returns correct OklchColor |
| AC-2 | Unit | parseColor('oklch(0.6 0.2 259)') returns exact values |
| AC-3 | Unit | parseColor('hsl(220, 90%, 60%)') returns valid OklchColor |
| AC-4 | Unit | parseColor('invalid') returns null |
| AC-5 | Unit | generatePalette returns 11 shades with correct steps |
| AC-6 | Unit | Shade lightness values match SHADE_LIGHTNESS curve |
| AC-7 | Unit | Shade 500 chroma = input chroma × 1.00 |
| AC-8 | Unit | formatColor hex output matches expected string |
| AC-9 | Unit | formatColor oklch output matches expected CSS |
| AC-10 | Unit | High-chroma green detected as P3/out |
| AC-11 | Unit | Normal-chroma blue detected as sRGB |
| AC-12 | Unit | All shades have valid hex (no NaN) |
| AC-13 | Unit | Contrast values are positive numbers in 0-108 range (Math.abs applied) |
| AC-14 | Unit | Lc 90 → 'AAA' |
| AC-15 | Unit | Lc 60 → 'AA' |
| AC-16 | Lint | No `from 'culori'` imports (only `culori/fn`) |
| AC-E1 | Unit | null/undefined input → null return |
| AC-E2 | Unit | Max chroma → all shades valid |
| AC-E3 | Unit | Hue 0 → no negative/overflow hues |
| AC-E4 | Unit | Achromatic (C=0, H=NaN) → valid grayscale, no NaN |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | Unit: invalid strings return null, never throw | BLOCKING |
| Error Journey | E2 | Unit: extreme chroma generates valid gamut-mapped colors | BLOCKING |
| Edge Case | EC1 | Unit: achromatic (C=0, H=NaN) generates valid grayscale with H=0 | BLOCKING |
| Edge Case | EC2 | Unit: hue wrapping at 355° + shift works | BLOCKING |
| Edge Case | EC3 | Unit: L=0 and L=1 inputs don't crash | BLOCKING |
| Edge Case | EC4 | Unit: named color 'rebeccapurple' parses | BLOCKING |
| Edge Case | EC5 | Unit: OKLCH with % lightness parses correctly (62.3% → 0.623) | BLOCKING |
| Spec Review | SR-1 | Unit: apca-w3 calcAPCA returns signed Lc; Math.abs produces 0-108 | BLOCKING |
| Spec Review | SR-2 | Unit: apca-w3 calcAPCA(light-shade-hex, '#000000') returns negative Lc | BLOCKING |
| Spec Review | SR-3 | Unit: hue shift for H=260 (blue) in light shades shifts toward H>260 (purple), not toward cyan | BLOCKING |

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| culori/fn | Real | Pure computation, deterministic, fast |
| apca-w3 | Real | Pure computation, deterministic |

### TDD Commitment

All lib/ functions developed TDD: write test → see it fail → implement → pass → refactor. Tests written BEFORE implementation.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| culori tree-shaking doesn't work with Next.js | MED | LOW | tsconfig path alias enforces `culori/fn`; test bundle early |
| Lightness/chroma curves produce ugly palettes | MED | MED | Compare output against Tailwind v4 blue + red + green visually |
| Float precision in OKLCH → HEX roundtrip | LOW | MED | Round to 3 decimal places, accept minor drift |
| Hue shift sign wrong for cool hues | MED | MED | Visual validation against Tailwind blue/indigo in scope item 1 |
| Chroma × 1.05 at shade 600 pushes saturated inputs out of P3 | MED | MED | Apply gamut cap after multiplier in color-engine.ts |

**Kill criteria:** None — apca-w3 for Lc measurement is decided (not a spike). If culori/fn tree-shaking fails, import specific functions directly.

## State Machine

N/A — all functions are stateless.

## Analysis

### Assumptions Challenged

| # | Assumption | Evidence For | Evidence Against | Verdict | Action |
|---|------------|-------------|-----------------|---------|--------|
| 1 | apca-w3 calcAPCA measures Lc of existing colors | apca-w3 README: `calcAPCA(textColor, bgColor)` → Lc number | N/A | **VALID** (decided) | → no action — use apca-w3 directly |
| 2 | APCA Lc range is 0-108 | Common documentation | **Lc is signed: -108 to +108.** Light-on-dark = negative. | **FIXED** | → AC-13 updated: store Math.abs(lc) |
| 3 | culori/fn `displayable(color, 'p3')` works as expected | culori docs | May require color in P3 space first | RISKY | → verify API signature in scope item 4 |
| 4 | SHADE_LIGHTNESS curve produces good palettes | Based on Tailwind v4 observed values | Single curve for all hues; yellows may need different treatment | VALID for MVP | → no action |
| 5 | Hue shift `(0.5-t)×maxShift` is correct for cool hues | Positive shift for light shades | For blue (H=260), positive shift = more purple, not toward cyan. Doc says "toward cyan" but that's wrong. Tailwind blues shift slightly purple in light shades — so the math is accidentally correct for blue. | VALID for blue, **needs verification for cyan/teal** | → visual validation in scope item 1 |

### Blind Spots

1. **[Color Science]** NaN hue on achromatic input — mitigated (guard added in EC1 + AC-E4)
2. **[Color Science]** Chroma 1.05× at shade 600 causes gamut overflow for saturated inputs — mitigated (gamut cap after multiplier in scope item 6)
3. **[Color Science]** Shade 500 L=0.650 fixed vs input L variable — the input color may not appear in the palette. This is by design (Tailwind pattern) but should be documented.
4. **[API]** `oklch(62.3% 0.214 259)` — verify culori normalizes % to 0-1 range (EC5 test covers this)

### Failure Hypotheses

| # | IF | THEN | BECAUSE | Severity | Mitigation |
|---|-----|------|---------|----------|------------|
| FH-1 | culori parse fails on `oklch(62.3% ...)` syntax | parseColor returns null for valid CSS | culori may treat 62.3 as raw number, not percentage | HIGH | Explicit unit test (EC5); if fails, add manual % normalization |
| FH-2 | Chroma curve produces washed-out palettes for low-chroma inputs | Shades 50-200 are near-gray | Multiplier 0.10 × low chroma ≈ 0 | MED | Add minimum chroma floor (e.g., 0.005) for non-zero inputs |
| FH-3 | apca-w3 calcAPCA returns unexpected format | contrast.ts breaks | API may return string or object, not number | LOW | Unit test verifies return type in first test |

### The Real Question

Confirmed — this is the computational core. apca-w3 for contrast is decided (no more spike). Get the engine right and everything else is UI wiring.

### Open Items

- [improvement] Consider minimum chroma floor for low-chroma inputs → update spec if testing confirms FH-2
- [gap] No visual validation of palette output → compare against Tailwind reference during curves.ts implementation

**Spec review applied: 2026-03-08** — apcach→apca-w3 (decided, not spike), APCA Lc signed→Math.abs, NaN hue guard, culori/fn enforcement, hue shift verification, gamut cap after chroma multiplier.

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | lib/curves.ts | pending | - |
| 2 | lib/color-parser.ts | pending | - |
| 3 | lib/color-formatter.ts | pending | - |
| 4 | lib/gamut.ts | pending | - |
| 5 | lib/contrast.ts (apca-w3) | pending | - |
| 6 | lib/color-engine.ts | pending | - |
| 7 | lib/utils.ts | pending | - |
| 8 | Vitest + tests | pending | - |
| 9 | culori/fn verification | pending | - |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-08T19:00:00Z | - | Created |
| spec-review | 2026-03-08T20:00:00Z | - | Merged: apca-w3, Lc signed, NaN guard, hue shift verify, gamut cap |
