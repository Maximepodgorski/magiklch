# Color Science — OKLCH Reference

## What is OKLCH?

OKLCH is a perceptually uniform cylindrical color space created by Bjorn Ottosson (2020). It represents colors with three channels:

| Channel | Range | Description |
|---------|-------|-------------|
| **L** (Lightness) | 0–1 (0%–100%) | Perceptual brightness. 0 = black, 1 = white |
| **C** (Chroma) | 0–0.4 | Color intensity/saturation. 0 = gray, higher = more vivid |
| **H** (Hue) | 0–360 | Color angle on the wheel. 0=pink, 90=yellow, 180=cyan, 270=blue |

CSS syntax: `oklch(0.623 0.214 259)` or `oklch(62.3% 0.214 259)`

## Why OKLCH over HSL?

| Property | HSL | OKLCH |
|----------|-----|-------|
| Perceptual uniformity | No — yellow at 50% L looks much brighter than blue at 50% L | Yes — same L value = same perceived brightness |
| Gamut | sRGB only | Can represent P3 and wider gamuts |
| Chroma control | Saturation ≠ chroma, behaves unpredictably | Chroma is independent, predictable |
| CSS support | Full | All modern browsers (Chrome 111+, Safari 15.4+, Firefox 113+) |
| Palette generation | Uneven shades across hues | Consistent shade generation regardless of hue |

The core insight: in HSL, `hsl(60, 100%, 50%)` (yellow) and `hsl(240, 100%, 50%)` (blue) have the same "lightness" but wildly different perceived brightness. OKLCH fixes this.

## Shade Generation Algorithm

### Lightness Curve

The lightness distribution across 11 shades follows a non-linear curve inspired by Tailwind v4. Light shades compress toward white, dark shades compress toward black.

```typescript
/**
 * Non-linear lightness curve for 11 shades.
 * Maps shade index (0=50, 10=950) to OKLCH lightness (0-1).
 * Based on Tailwind v4 observed distribution.
 */
const SHADE_LIGHTNESS: Record<number, number> = {
  50:  0.975,  // Near white
  100: 0.940,
  200: 0.895,
  300: 0.830,
  400: 0.735,
  500: 0.650,  // Base mid-tone
  600: 0.560,
  700: 0.480,
  800: 0.420,
  900: 0.370,
  950: 0.270,  // Near black
};

const SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type ShadeStep = typeof SHADE_STEPS[number];
```

The curve is intentionally **not** linear:
- Steps 50→200 are compressed (small L differences) — subtle tints
- Steps 300→700 are spread out — the working range for UI
- Steps 800→950 are compressed again — deep shadows

### Chroma Curve

Chroma follows a bell curve peaking around shade 500–600, tapering toward light and dark extremes. This matches natural perception: very light and very dark colors appear less saturated.

```typescript
/**
 * Chroma multiplier curve.
 * The base chroma (from user input) is scaled by this factor per shade.
 * Peak saturation at 500-600, reduced at extremes.
 */
const CHROMA_MULTIPLIER: Record<number, number> = {
  50:  0.10,
  100: 0.20,
  200: 0.40,
  300: 0.65,
  400: 0.85,
  500: 1.00,  // Full chroma from input
  600: 1.05,  // Slightly over-saturated (Tailwind pattern)
  700: 0.90,
  800: 0.75,
  900: 0.60,
  950: 0.40,
};
```

### Hue Shift

Hue shifts slightly across the lightness range. Warm colors (red, orange) shift toward yellow in lighter shades. Cool colors (blue, indigo) shift toward cyan. This matches natural pigment behavior.

```typescript
/**
 * Hue offset per shade (degrees).
 * Positive = shift toward yellow/warm. Negative = shift toward cool.
 * Applied per-shade to the base hue.
 */
function getHueShift(baseHue: number, shade: ShadeStep): number {
  const shadeIndex = SHADE_STEPS.indexOf(shade);
  const t = shadeIndex / (SHADE_STEPS.length - 1); // 0 (light) to 1 (dark)

  // Warm hues (0-90, 300-360) shift more
  const isWarm = baseHue < 90 || baseHue > 300;
  const maxShift = isWarm ? 8 : 4;

  // Light shades shift away from base, dark shades shift opposite
  return (0.5 - t) * maxShift;
}
```

### Full Generation Pipeline

```
Input color (any format)
    │
    ▼
┌───────────────┐
│  culori.parse  │  → OklchColor { l, c, h }
└───────┬───────┘
        │
        ▼
┌───────────────────────┐
│  For each shade step:  │
│  1. L = SHADE_LIGHTNESS[step]
│  2. C = input.c × CHROMA_MULTIPLIER[step]
│  3. H = input.h + getHueShift(input.h, step)
│  4. Gamut check (sRGB / P3)
│  5. APCA contrast vs white & black
└───────────────────────┘
        │
        ▼
  PaletteShade[11]
```

## Gamut Mapping

### The Problem

OKLCH can represent colors outside the sRGB gamut. A color like `oklch(0.7 0.35 150)` (vivid green) exists in OKLCH math but cannot be displayed on standard sRGB monitors. It can, however, be displayed on wide-gamut (P3) screens.

### Gamut Boundaries

```
            Chroma →
    0     0.1    0.2    0.3    0.4
    ├──────┼──────┼──────┼──────┤
    │      sRGB        │  P3   │
    │  (most screens)  │ only  │  Out of
    │                  │       │  gamut
    └──────────────────┴───────┘
```

- **In sRGB gamut** — Displayable on all screens
- **In P3 gamut only** — Displayable on modern Apple/HDR screens
- **Out of gamut** — Not displayable, will be clamped by browser

### culori Gamut Mapping API

```typescript
import { displayable, toGamut, converter } from 'culori';

const toOklch = converter('oklch');
const color = toOklch('oklch(0.7 0.35 150)');

// Check if displayable
displayable(color);           // false (out of sRGB)
displayable(color, 'p3');     // true (within P3)

// Map to sRGB gamut (reduces chroma, preserves hue + lightness)
const srgbSafe = toGamut('rgb')(color);

// Map to P3 gamut
const p3Safe = toGamut('p3')(color);
```

Key behavior: `toGamut()` reduces chroma (desaturates) until the color fits the target gamut, preserving the perceived lightness and hue. This is preferable to simple clamping which can shift hue.

### UI Gamut Indicators

Each shade displays gamut status:

| Status | Badge | Meaning |
|--------|-------|---------|
| sRGB safe | (none) | Displayable on all screens |
| P3 only | `P3` | Requires wide-gamut display |
| Clamped | `!` | Was out of gamut, has been mapped |

## APCA Contrast

### What is APCA?

APCA (Accessible Perceptual Contrast Algorithm) is the next-generation contrast method, successor to WCAG 2.x contrast ratios. Created by Andrew Somers, APCA is the candidate method for WCAG 3.0.

Key differences from WCAG 2.x:
- Reports contrast as **Lc** (Lightness Contrast), range 0–108
- Accounts for **polarity** — dark-on-light vs light-on-dark have different thresholds
- Considers **font weight and size** — thin fonts need higher contrast

### APCA Thresholds

| Lc value | Use case | Badge |
|----------|----------|-------|
| ≥ 90 | Body text, 14px+ normal weight | `AAA` |
| ≥ 75 | Body text, 18px+ normal weight | `AA` |
| ≥ 60 | Large text, 24px+, headings | `AA` |
| ≥ 45 | Large text, 36px+, bold headings | `A` |
| ≥ 30 | Non-text, icons, focus indicators | — |
| < 30 | Insufficient for any text | `Fail` |

### apcach Integration

```typescript
import { apcach, crToBg, crToFg, apcachToCss } from 'apcach';

// Generate a color with Lc 60 contrast against white background
const color = apcach(crToBg('#ffffff', 60), 0.2, 259);
apcachToCss(color, 'oklch');  // → "oklch(52.71% 0.2 259)"
apcachToCss(color, 'hex');    // → "#2b6cd4"

// Generate a color for foreground use against dark background
const fgColor = apcach(crToFg('#1a1a1a', 75), 0.15, 145);

// Supported contrast models
apcach(crToBg('#fff', 60, 'apca'), 0.2, 259);  // APCA (default, 0-108)
apcach(crToBg('#fff', 4.5, 'wcag'), 0.2, 259); // WCAG (1-21)
```

### Contrast Calculation for Shades

For each generated shade, we calculate two APCA Lc values:
1. **On white** — shade as foreground on `#ffffff` background
2. **On black** — shade as foreground on `#000000` background

The higher absolute Lc determines the recommended usage (light or dark background) and the badge.

## CSS oklch() Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 111+ | Full support |
| Safari | 15.4+ | Full support |
| Firefox | 113+ | Full support |
| Edge | 111+ | Full support |
| Opera | 97+ | Full support |

Global support: ~95% of users (as of early 2026).

Fallback strategy: provide HEX fallback for the <5% on older browsers.

```css
/* With fallback */
.element {
  color: #3b82f6;                    /* Fallback */
  color: oklch(0.623 0.214 259);     /* Modern */
}
```

## References

- [OKLCH in CSS](https://oklch.com/) — Interactive color picker by Evil Martians
- [Bjorn Ottosson — A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/)
- [Evil Martians — OKLCH ecosystem tools](https://evilmartians.com/chronicles/exploring-the-oklch-ecosystem-and-its-tools)
- [APCA Contrast Calculator](https://apcacontrast.com/)
- [culori Documentation](https://culorijs.org/api/)
- [apcach — APCA contrast in OKLCH](https://github.com/antiflasher/apcach)
- [Tailwind CSS v4 — OKLCH colors](https://tailwindcss.com/blog/tailwindcss-v4)
