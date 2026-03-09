# Product — OKLCH Palette Generator

## Vision

A best-in-class open-source web tool for generating, exploring, and sharing OKLCH color palettes. Built for designers and developers who want perceptually uniform colors with real contrast data.

**One-liner:** Generate production-ready OKLCH palettes with APCA contrast scores, gamut warnings, and 1-click copy.

## Problem Statement

Current color tools have 3 blind spots:

1. **Wrong color space** — Most generators use HSL/HSB, producing perceptually uneven shades (e.g., yellow-500 and blue-500 at the same L value look wildly different in brightness)
2. **No contrast data** — Designers pick colors, then manually check contrast ratios after the fact. Contrast should be built into the generation step
3. **No gamut awareness** — Colors generated in wide-gamut spaces (OKLCH) may fall outside sRGB, causing unexpected clamping in browsers

OKLCH solves all three: perceptual uniformity by design, predictable lightness for contrast, and explicit gamut boundaries.

## Audience

| Persona | Need | Key feature |
|---------|------|-------------|
| **Design Engineer** | Generate Tailwind-compatible palettes fast | Input hue → get 11 shades, copy CSS variables |
| **UI Designer** | Explore colors with perceptual accuracy | OKLCH sliders, real-time preview, dark mode |
| **Design System Lead** | Curate brand palettes with contrast compliance | APCA scores per shade, gamut badges |
| **Developer** | Grab color values for a project | 1-click copy (HEX/OKLCH/HSL), URL sharing |

## User Stories

### Must-Have (V1.0 MVP)

| # | Story | Acceptance criteria |
|---|-------|-------------------|
| US-1 | As a user, I can enter a base color (HEX, OKLCH, or HSL) and get an 11-shade palette (50–950) | Input field accepts multiple formats; generates shades instantly |
| US-2 | As a user, I can see each shade's OKLCH values, HEX equivalent, and APCA contrast score | ShadeCard displays all 3 data points + visual badge |
| US-3 | As a user, I can copy any color value in 1 click | Click → copies to clipboard → visual confirmation |
| US-4 | As a user, I can switch between color format outputs (OKLCH, HEX, HSL, CSS variable) | Format toggle persists during session |
| US-5 | As a user, I can browse a catalogue of pre-built palettes (Tailwind v4 + curated) | `/catalogue` page with search/filter |
| US-6 | As a user, I can share a palette via URL | All palette state encoded in URL search params |
| US-7 | As a user, I can see gamut warnings when a shade falls outside sRGB | Visual indicator (badge/icon) on out-of-gamut shades |
| US-8 | As a user, I can generate a random palette | `/random` route + button on generator |
| US-9 | As a user, I can use the tool in dark mode | System preference detection + manual toggle, full dark theme |

### Should-Have (V1.0)

| # | Story | Acceptance criteria |
|---|-------|-------------------|
| US-10 | As a user, I can control Lightness, Chroma, and Hue via dedicated slider bars | 3 range sliders (L: 0–100%, C: 0–0.4, H: 0–360°) with numeric input fields; real-time palette update |
| US-11 | As a user, I can see a P3 gamut indicator alongside sRGB | Dual gamut badges on ShadeCard |
| US-12 | As a user, I can navigate the entire UI with keyboard | Full keyboard nav, visible focus indicators |
| US-13 | As a user, I see shade cards with just the color swatch and shade number — OKLCH values appear on hover as a tooltip | Clean minimal cards; hover/focus triggers tooltip with OKLCH/HEX values |
| US-14 | As a user, I can copy the entire palette in multiple output formats (CSS variables, JSON, SCSS, Tailwind config, CSS-in-JS) | Format selector + "Copy all" button; outputs production-ready code blocks |

### V1.1 — Claude Code Skill

| # | Story | Acceptance criteria |
|---|-------|-------------------|
| US-15 | As a Claude Code user, I can run `/oklch <color>` to generate a palette in terminal | Skill outputs formatted palette in terminal |
| US-16 | As a Claude Code user, I can run `/oklch --css` to get copy-pasteable CSS variables | Outputs `:root { --color-50: ... }` block |

## MVP Features (V1.0)

### Core

- **Color input** — Two input modes: (1) direct color string (HEX, OKLCH, HSL, RGB, named CSS) via `culori`, (2) L/C/H slider controls with numeric inputs (Lightness 0–100%, Chroma 0–0.4, Hue 0–360°) — inspired by oklch.com
- **Shade generation** — 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) with non-linear lightness curve and chroma bell curve
- **Palette display** — Clean grid of ShadeCards showing swatch + shade number only; OKLCH/HEX values revealed on hover via tooltip
- **APCA contrast** — Real-time Lc values via `apcach`, badges (AAA/AA/A/Fail) against white and black backgrounds
- **Gamut mapping** — sRGB/P3 gamut check via `culori`, visual warning on out-of-gamut shades
- **Copy** — 1-click copy for any value (OKLCH, HEX, HSL, CSS var), toast confirmation
- **Format toggle** — Switch output format globally (OKLCH / HEX / HSL / CSS custom property)
- **Multi-format export** — Copy entire palette as CSS variables, JSON, SCSS `$map`, Tailwind config extend, CSS-in-JS object — all major styling technologies covered

### Catalogue

- All 22 Tailwind v4 palettes with official OKLCH values
- 5-8 curated custom palettes
- Search by name, filter by hue range
- Click any palette → opens in generator for customization

### Random

- Generate random palette with pleasing hue/chroma distribution
- "Shuffle" button for rapid exploration
- Share via URL

### Infrastructure

- **URL state** — All palette params in URL search params (`?h=259&c=0.214&name=blue`)
- **Dark mode** — System preference + manual toggle, full theme support
- **Responsive** — Mobile-first, works on all viewports
- **Performance** — <100ms generation, <1s initial load, 100 Lighthouse score target

## V2 Roadmap

| Feature | Description | Priority |
|---------|-------------|----------|
| Multi-palette workspace | Create and compare multiple palettes side-by-side | High |
| Export Tailwind config | Generate `tailwind.config.ts` color extension | High |
| Export Figma variables | Generate Figma variables JSON for import | Medium |
| Semantic color builder | Map palette shades to semantic tokens (primary, destructive, muted...) | Medium |
| Harmony wheel | Complementary, analogous, triadic, split-comp suggestions | Medium |
| Color blindness simulator | Preview palette under different color vision deficiencies | Low |
| Palette analytics | Distribution charts for lightness, chroma, hue across shades | Low |

## Non-Goals

- **Not a full design system tool** — We generate palettes, not complete token systems
- **Not an image color picker** — No image upload or eyedropper (browser native suffices)
- **Not a Figma plugin** — Web-first; Figma export is V2
- **No user accounts** — URL sharing replaces the need for saved palettes
- **No backend** — Pure client-side app, zero server dependencies
- **No color space education** — Brief tooltips, but not a learning platform

## Success Metrics

| Metric | Target | How measured |
|--------|--------|-------------|
| Time to first palette | <5 seconds | User lands → has a generated palette |
| Copy-to-clipboard actions | >3 per session | Analytics event |
| URL shares | >10% of sessions generate a share URL | Analytics event |
| Lighthouse Performance | 100 | Lighthouse CI |
| Bundle size | <150KB gzipped | Build output |
| Catalogue browse rate | >30% of sessions visit `/catalogue` | Analytics event |
