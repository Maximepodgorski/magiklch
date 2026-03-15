# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Magiklch — OKLCH color palette generator. Pure client-side Next.js app. Input any CSS color, get perceptually uniform shades (4–12 configurable) using OKLCH color science + APCA contrast scoring. No backend, no database.

Live: https://magiklch.vercel.app

## Commands

```bash
npm run dev          # Next.js dev server with Turbopack (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npx vitest           # Run all tests
npx vitest run path  # Run single test file
```

## Architecture

```
User Input (any CSS color) > color-parser > color-engine > Palette { N shades }
                                               |-- curves (L/C/H per step)
                                               |-- gamut (sRGB/P3 check + clamp)
                                               |-- contrast (APCA via apca-w3)
                                               |-- contrast-matrix (NxN pairwise APCA)
                                               +-- color-formatter (HEX/HSL/OKLCH/cssvar)
```

See [docs/ENGINEERING.md](docs/ENGINEERING.md) for full file tree, TypeScript interfaces, and API details.
See [docs/COLORS.md](docs/COLORS.md) for OKLCH color science, APCA thresholds, and gamut mapping.

### Color Engine (`lib/`)

All functions are **pure** (no I/O, no state, no DOM). 141 test cases via Vitest.

| File | Purpose |
|------|---------|
| `color-parser.ts` | Parse any CSS color (hex, hsl, oklch, rgb, named) to OKLCH |
| `color-engine.ts` | Generate shades from OKLCH input with gamut + APCA |
| `color-formatter.ts` | Format OKLCH to hex, hsl, CSS oklch, CSS var |
| `contrast.ts` | APCA contrast (apca-w3) — `getContrast`, `getContrastFromHex`, `getContrastLevel` |
| `contrast-matrix.ts` | NxN pairwise APCA contrast matrix from palette shades |
| `curves.ts` | L/C/H curves per shade step (50–975) |
| `gamut.ts` | Gamut check (sRGB vs P3) + sRGB clamping |
| `utils.ts` | Utility functions (round, clamp) |
| `setup-culori.ts` | Register culori modes/parsers (MUST import before using culori) |

### Key Design Decisions

- Input lightness is always **discarded** — `SHADE_LIGHTNESS` curve determines L for each shade
- Gamut check happens BEFORE sRGB mapping — `gamut` field reflects the original color
- HEX/HSL output comes from the sRGB-mapped (safe) version
- APCA uses absolute Lc values (`Math.abs`), not signed — thresholds: AAA ≥ 75, AA ≥ 60, A ≥ 45
- NaN hue guard for achromatic inputs (`h = isNaN(h) ? 0 : h`)
- culori imported via `culori/fn` (enforced by tsconfig + vitest aliases) — never `culori` directly
- Every file using culori must start with `import "./setup-culori"`

### URL-First State

All palette state lives in URL search params (`?h=259&c=0.214&name=blue`). No global state store.

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Generator: seed color, L/C/H sliders, scale (4–12), gamut, pill tabs (Shades/Contrast), export |
| `/catalogue` | Browse 22 Tailwind + 7 curated palettes |
| `/catalogue/[palette]` | Palette detail with full specs |
| `/random` | Random palette generator |
| `/docs` | Interactive OKLCH guide with 5 live demos |
| `/blocks` | Brand palette preview in UI blocks |

## Component System

**Always use Lyse Registry components first.** If no Lyse component exists, fall back to shadcn/ui + Radix.

See [docs/DESIGN.md](docs/DESIGN.md) for wireframes, interaction patterns, and responsive strategy.

### Dual-File Pattern

Every UI component has two files:
- `component.tsx` — Structure, variants (CVA), Radix primitives, `data-slot` attributes
- `component.css` — Visual theming only, uses semantic CSS tokens (no hardcoded colors)

Customize appearance by editing `.css` only — never hardcode colors in `.tsx`.

### Available Lyse Components (`components/ui/`)

action-card, avatar, badge, banner-info, button, callout-card, checkbox, chip, dropdown-menu, input, menu, modal, progress, radio, select, spinner, spotlight-card, table, tabs, tag, textarea, toast, toggle, tooltip

### Component Folders

| Folder | Contents |
|--------|----------|
| `components/ui/` | 20+ Lyse Registry components (dual-file pattern) |
| `components/layout/` | header, sidebar, sidebar-context, page-header, theme-pill, footer, export-footer, logo-svg |
| `components/palette/` | color-input, contrast-grid, lch-sliders, palette-grid, shade-card, format-toggle, export-palette, generator-shell |
| `components/catalogue/` | catalogue-grid, catalogue-filter, palette-preview, palette-detail-shell |
| `components/docs/` | section-nav, channel-explorer, uniformity-demo, gradient-comparison, gamut-explorer, live-palette-demo |
| `components/random/` | random-shell |
| `components/shared/` | copy-button, gamut-badge, contrast-badge |

### Component Conventions

- Named exports only (no `default` exports)
- `data-slot="component-name"` on root elements
- CVA for variant management, CSS classes for theming
- Focus ring: `box-shadow` double-layer (white gap + color ring), not `outline`
- `isIconOnly` prop adds `aspect-square px-0`
- Compound components share context (e.g., Tabs > TabsContext stores variant + size)

## Hooks

| Hook | Purpose |
|------|---------|
| `use-palette.ts` | Manage palette state from URL params (h, c, l, name) |
| `use-color-format.ts` | Manage output format preference (hex/hsl/oklch/cssvar) |
| `use-copy.ts` | Copy-to-clipboard with toast notification |

## Data (`data/`)

| File | Purpose |
|------|---------|
| `all-palettes.ts` | Union of tailwind + curated palettes |
| `tailwind-palettes.ts` | 22 Tailwind-inspired palettes |
| `curated-palettes.ts` | 7 curated palettes |

See [docs/PALETTES.md](docs/PALETTES.md) for full palette data, curation criteria, and naming conventions.

## Types (`types/color.ts`)

Core types: `OklchColor`, `ShadeStep` (50–975), `GamutStatus`, `ContrastLevel`, `PaletteShade`, `Palette`, `ColorInput`, `ColorFormat`, `PaletteUrlState`

See [docs/ENGINEERING.md](docs/ENGINEERING.md) for full interface definitions.

## CSS Token Architecture

Three-layer system in `styles/lyse/`:

```
Layer 1: Primitives      root-colors.css, root-typography.css, root-layout.css
         (raw values)    --root-color-brand-500, --root-font-size-md, --root-space-4

Layer 2: Semantics       semantic-colors.css, semantic-global.css
         (mode-aware)    --background-brand-strong-default (flips in .dark)

Layer 3: shadcn Bridge   shadcn-bridge.css
         (integration)   --background, --primary > maps to Layer 2 tokens
```

**Always use semantic tokens (Layer 2)** in component CSS. Use primitives only when semantic tokens don't cover the case. Never use raw color values.

## Dark Mode

- `next-themes` with `attribute="class"` and `@custom-variant dark (&:is(.dark *))`
- Semantic tokens auto-flip in `.dark {}` blocks
- Color swatches render at actual color regardless of theme

## Tailwind v4

No `tailwind.config.ts` — configured via `@theme inline {}` in `globals.css`. CSS custom properties are mapped to Tailwind utilities there.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 + React 19 + Tailwind v4 |
| UI | Lyse Registry + Radix UI + CVA |
| Color | culori (tree-shaken via `culori/fn`) + apca-w3 |
| Fonts | DM Sans (headings) + Inter (body) |
| Icons | react-icons/bi (BoxIcons) + lucide-react |
| Theme | next-themes |
| Testing | Vitest (141 tests on pure functions) |
| Deploy | Vercel |

## Docs Page (`/docs`)

Interactive OKLCH guide with 7 sections and 5 client-side demo components:

| Section | Demo Component | What it does |
|---------|---------------|--------------|
| Introduction | (static) | Hero, OKLCH spectrum bar, badges |
| Problem with HSL | `uniformity-demo.tsx` | Single lightness slider, 8 hues HSL vs OKLCH |
| Three channels | `channel-explorer.tsx` | L/C/H sliders with live color bar + CSS output |
| Better gradients | `gradient-comparison.tsx` | 4 HSL vs OKLCH gradient pairs side by side |
| Wide gamut | `gamut-explorer.tsx` | Hue + chroma sliders with sRGB/P3 badge |
| Build palettes | `live-palette-demo.tsx` | Color input with 4 presets, instant 11-shade output |
| Use in CSS | (static) | Single code block with syntax examples |

Right-side sticky anchor nav (`section-nav.tsx`) visible on xl+ screens, uses IntersectionObserver on `#main-content`.

## Specs

Active spec in `specs/active/`. Shipped specs in `specs/shipped/`. Reference docs in `docs/`:

| Doc | Content |
|-----|---------|
| [ENGINEERING.md](docs/ENGINEERING.md) | File tree, TypeScript interfaces, API reference, build pipeline |
| [DESIGN.md](docs/DESIGN.md) | Wireframes, component map, interaction patterns, responsive strategy |
| [COLORS.md](docs/COLORS.md) | OKLCH color science, APCA contrast, gamut mapping |
| [PRODUCT.md](docs/PRODUCT.md) | Vision, user stories, feature roadmap |
| [PALETTES.md](docs/PALETTES.md) | Tailwind + curated palette data, curation criteria |
