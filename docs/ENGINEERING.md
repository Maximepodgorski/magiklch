# Engineering — Architecture & Implementation

## Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 16.x | SSR, routing, file-based pages |
| UI | React | 19.x | Component rendering |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Components | Lyse Registry | latest | Pre-built UI components (shadcn pattern) |
| Color Engine | culori | 4.x | Color parsing, conversion, gamut mapping |
| Contrast | apca-w3 | latest | APCA contrast calculation (calcAPCA) |
| Language | TypeScript | 5.x | Type safety |
| Testing | Vitest | latest | 141 unit tests on pure functions |

## File Tree

```
magiklch/
├── app/
│   ├── layout.tsx              # Root layout (dark mode, fonts, metadata)
│   ├── page.tsx                # Generator page (/)
│   ├── catalogue/
│   │   ├── page.tsx            # Catalogue page (/catalogue)
│   │   └── [palette]/
│   │       └── page.tsx        # Palette detail (/catalogue/[palette])
│   ├── random/
│   │   └── page.tsx            # Random palette page (/random)
│   ├── docs/
│   │   └── page.tsx            # Interactive OKLCH guide (/docs)
│   ├── blocks/
│   │   └── page.tsx            # Brand palette preview (/blocks)
│   └── globals.css             # Tailwind v4 imports + @theme inline
├── components/
│   ├── ui/                     # Lyse Registry components (auto-installed)
│   │   ├── button/             # button.tsx + button.css
│   │   ├── badge/
│   │   ├── input/
│   │   ├── tabs/
│   │   ├── table/              # table.tsx + table.css (compact, striped)
│   │   ├── toast/
│   │   ├── tooltip/
│   │   ├── toggle/
│   │   ├── select/
│   │   ├── dropdown-menu/
│   │   └── ... (20+ total)
│   ├── palette/
│   │   ├── generator-shell.tsx # Main generator orchestrator
│   │   ├── contrast-grid.tsx   # NxN APCA contrast matrix table
│   │   ├── color-input.tsx     # Color input field + format detection
│   │   ├── lch-sliders.tsx     # L/C/H range sliders
│   │   ├── palette-grid.tsx    # Grid of shade swatches
│   │   ├── shade-card.tsx      # Single shade display
│   │   └── format-toggle.tsx   # OKLCH / HEX / HSL / CSS var switcher
│   ├── catalogue/
│   │   ├── catalogue-grid.tsx  # Grid of palette previews
│   │   ├── catalogue-filter.tsx # Search + hue filter
│   │   ├── palette-preview.tsx # Mini palette card
│   │   └── palette-detail-shell.tsx # Full palette detail page
│   ├── layout/
│   │   ├── header.tsx          # Logo + theme pill + GitHub link
│   │   ├── sidebar.tsx         # Collapsible navigation
│   │   ├── sidebar-context.tsx # Sidebar state context
│   │   ├── page-header.tsx     # Page title + subtitle
│   │   ├── theme-pill.tsx      # Dark/light/system mode toggle
│   │   ├── footer.tsx          # Links, credits
│   │   ├── export-footer.tsx   # Export format selector + copy button
│   │   └── logo-svg.tsx        # Logo component
│   ├── docs/
│   │   ├── section-nav.tsx     # Sticky anchor nav (xl+)
│   │   ├── channel-explorer.tsx
│   │   ├── uniformity-demo.tsx
│   │   ├── gradient-comparison.tsx
│   │   ├── gamut-explorer.tsx
│   │   └── live-palette-demo.tsx
│   ├── random/
│   │   └── random-shell.tsx
│   └── shared/
│       ├── copy-button.tsx     # 1-click copy with toast
│       ├── gamut-badge.tsx     # sRGB/P3 indicator
│       └── contrast-badge.tsx  # APCA Lc badge (AAA/AA/A/Fail)
├── lib/
│   ├── color-engine.ts         # Core: generate palette from input
│   ├── color-parser.ts         # Parse any color format → OKLCH
│   ├── color-formatter.ts      # Format OKLCH → HEX/HSL/CSS var
│   ├── gamut.ts                # Gamut checking + sRGB mapping
│   ├── contrast.ts             # APCA: getContrast, getContrastFromHex, getContrastLevel
│   ├── contrast-matrix.ts      # NxN pairwise APCA contrast matrix
│   ├── curves.ts               # Lightness + chroma + hue curves
│   ├── utils.ts                # round, clamp helpers
│   ├── setup-culori.ts         # Register culori modes (import first!)
│   └── __tests__/              # Vitest tests (141 cases)
│       ├── color-engine.test.ts
│       ├── color-parser.test.ts
│       ├── color-formatter.test.ts
│       ├── contrast.test.ts
│       ├── contrast-matrix.test.ts
│       ├── curves.test.ts
│       └── gamut.test.ts
├── hooks/
│   ├── use-palette.ts          # Main palette state hook (URL params)
│   ├── use-color-format.ts     # Format preference state
│   └── use-copy.ts             # Copy-to-clipboard with toast
├── data/
│   ├── all-palettes.ts         # Union of tailwind + curated
│   ├── tailwind-palettes.ts    # 22 Tailwind v4 palettes
│   └── curated-palettes.ts     # 7 curated palettes
├── types/
│   └── color.ts                # All TypeScript interfaces
├── styles/lyse/                # 3-layer CSS token system
│   ├── root-colors.css         # Layer 1: primitive color tokens
│   ├── root-typography.css     # Layer 1: font tokens
│   ├── root-layout.css         # Layer 1: spacing/radius tokens
│   ├── semantic-colors.css     # Layer 2: mode-aware semantics
│   ├── semantic-global.css     # Layer 2: global semantics
│   └── shadcn-bridge.css       # Layer 3: shadcn variable mapping
├── docs/                       # Reference documentation
├── specs/                      # Feature specs (active/shipped/dropped)
├── next.config.ts
├── tsconfig.json
└── package.json
```

## TypeScript Interfaces

```typescript
// types/color.ts

/** OKLCH color representation */
export interface OklchColor {
  l: number;  // Lightness 0-1
  c: number;  // Chroma 0-0.4
  h: number;  // Hue 0-360
}

/** Shade step values matching Tailwind convention */
export type ShadeStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 975;

export const SHADE_STEPS: readonly ShadeStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975];

/** Gamut status for a color */
export type GamutStatus = 'srgb' | 'p3' | 'out';

/** APCA contrast badge level */
export type ContrastLevel = 'AAA' | 'AA' | 'A' | 'Fail';

/** Single shade in a palette */
export interface PaletteShade {
  step: ShadeStep;
  oklch: OklchColor;
  hex: string;
  hsl: string;
  cssOklch: string;              // "oklch(0.623 0.214 259)"
  cssVar: string;                // "--color-blue-500"
  gamut: GamutStatus;
  contrast: {
    onWhite: number;             // APCA Lc value
    onBlack: number;             // APCA Lc value
    level: ContrastLevel;        // Best of onWhite/onBlack
  };
}

/** Color output format options */
export type ColorFormat = 'oklch' | 'hex' | 'hsl' | 'cssvar';

/** Complete palette */
export interface Palette {
  id: string;                    // URL-safe slug
  name: string;                  // Display name
  source: 'tailwind' | 'curated' | 'generated' | 'random';
  baseColor: OklchColor;         // The input color (shade-500 equivalent)
  shades: PaletteShade[];        // Always 11 shades
}

/** User input — any color format accepted */
export interface ColorInput {
  raw: string;                   // User input string
  parsed: OklchColor | null;     // Parsed result (null if invalid)
  format: 'hex' | 'oklch' | 'hsl' | 'rgb' | 'named' | 'unknown';
}

/** URL state for sharing */
export interface PaletteUrlState {
  h: number;                     // Hue
  c: number;                     // Chroma
  l?: number;                    // Lightness (optional, defaults to 0.65)
  name?: string;                 // Custom name
}
```

## Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Generator — seed color, L/C/H sliders, scale (4-12), gamut, tabs (Shades/Contrast), export |
| `/catalogue` | `app/catalogue/page.tsx` | Browse Tailwind + curated palettes |
| `/catalogue/[palette]` | `app/catalogue/[palette]/page.tsx` | Palette detail with full specs |
| `/random` | `app/random/page.tsx` | Random palette generator |
| `/docs` | `app/docs/page.tsx` | Interactive OKLCH guide with 5 demos |
| `/blocks` | `app/blocks/page.tsx` | Brand palette preview in UI blocks |

## State Management

### URL-First Architecture

All palette state lives in URL search params. No global state store needed.

```
https://magiklch.vercel.app/?h=259&c=0.214&l=0.623&name=blue
```

### `usePalette` Hook

```typescript
// hooks/use-palette.ts
import { useSearchParams } from 'next/navigation';

export function usePalette() {
  const searchParams = useSearchParams();

  // Read from URL
  const h = Number(searchParams.get('h') ?? 259);
  const c = Number(searchParams.get('c') ?? 0.214);
  const l = Number(searchParams.get('l') ?? 0.65);
  const name = searchParams.get('name') ?? '';

  // Generate palette from params
  const palette = generatePalette({ l, c, h }, name);

  // Update URL (replaces state, no navigation)
  function updateColor(color: Partial<OklchColor>) { /* ... */ }
  function updateName(name: string) { /* ... */ }

  return { palette, updateColor, updateName, shareUrl: window.location.href };
}
```

### `useColorFormat` Hook

```typescript
// hooks/use-color-format.ts
// Persists format preference in localStorage
export function useColorFormat(): [ColorFormat, (f: ColorFormat) => void];
```

## Lyse Registry Integration

### Installation

```bash
# Init shadcn in the project (one-time)
npx shadcn@latest init

# Install components from Lyse Registry
npx shadcn@latest add https://ui.getlyse.com/r/button.json
npx shadcn@latest add https://ui.getlyse.com/r/badge.json
npx shadcn@latest add https://ui.getlyse.com/r/input.json
npx shadcn@latest add https://ui.getlyse.com/r/tabs.json
npx shadcn@latest add https://ui.getlyse.com/r/toast.json
npx shadcn@latest add https://ui.getlyse.com/r/tooltip.json
npx shadcn@latest add https://ui.getlyse.com/r/toggle.json
npx shadcn@latest add https://ui.getlyse.com/r/select.json
npx shadcn@latest add https://ui.getlyse.com/r/dropdown-menu.json
```

### Dual-File Pattern

Each Lyse Registry component installs as two files:

```
components/ui/
├── button.tsx    ← Structure, variants (CVA), Radix primitives
└── button.css    ← Theming via CSS custom properties
```

- **`.tsx`** — Component logic. Uses CVA for variants. Built on Radix UI.
- **`.css`** — Visual theming only. All colors/spacing via CSS custom properties.

Customize appearance by editing the `.css` file without touching component logic.

### Token Architecture (3 Layers)

```
┌────────────────────────────────┐
│  Layer 1: Primitives           │  --primitive-blue-500: oklch(...)
│  Raw design tokens             │
├────────────────────────────────┤
│  Layer 2: Semantics            │  --color-primary: var(--primitive-blue-500)
│  Context-aware mappings        │  --color-destructive: var(--primitive-red-500)
├────────────────────────────────┤
│  Layer 3: shadcn Bridge        │  Maps to shadcn/ui variable names
│  Integration layer             │  --background, --foreground, --border, etc.
└────────────────────────────────┘
```

All 3 layers auto-adapt to light/dark mode.

## Color Engine API

### culori — Core Color Operations

```typescript
// lib/color-engine.ts
import { parse, converter, formatHex, formatCss, displayable, toGamut } from 'culori';

const toOklch = converter('oklch');
const toRgb = converter('rgb');

// Parse any CSS color string to OKLCH
export function parseColor(input: string): OklchColor | null {
  const parsed = parse(input);
  if (!parsed) return null;
  const oklch = toOklch(parsed);
  return { l: oklch.l, c: oklch.c ?? 0, h: oklch.h ?? 0 };
}

// Convert OKLCH to hex
export function oklchToHex(color: OklchColor): string {
  return formatHex({ mode: 'oklch', ...color });
}

// Convert OKLCH to CSS string
export function oklchToCss(color: OklchColor): string {
  return formatCss({ mode: 'oklch', ...color });
}

// Check gamut status
export function getGamutStatus(color: OklchColor): GamutStatus {
  const c = { mode: 'oklch' as const, ...color };
  if (displayable(c)) return 'srgb';
  if (displayable(c, 'p3')) return 'p3';
  return 'out';
}

// Map to sRGB gamut (preserves hue + lightness, reduces chroma)
export function mapToSrgb(color: OklchColor): OklchColor {
  const mapped = toGamut('rgb')({ mode: 'oklch', ...color });
  const oklch = toOklch(mapped);
  return { l: oklch.l, c: oklch.c ?? 0, h: oklch.h ?? 0 };
}
```

### Tree-Shaking

For optimal bundle size, import from `culori/fn`:

```typescript
import { useMode, modeOklch, modeRgb, parse, formatHex, toGamut } from 'culori/fn';

// Register only the color spaces we need
useMode(modeOklch);
useMode(modeRgb);
```

### apca-w3 — APCA Contrast

```typescript
// lib/contrast.ts
import { calcAPCA } from "apca-w3";

/** APCA Lc between two OKLCH colors (via gamut-clamped hex) */
export function getContrast(fg: OklchColor, bg: OklchColor): number {
  const rawLc = calcAPCA(toHex(fg), toHex(bg));
  return Math.abs(Number(rawLc));
}

/** APCA Lc between two hex strings */
export function getContrastFromHex(fgHex: string, bgHex: string): number {
  const rawLc = calcAPCA(fgHex, bgHex);
  return Math.abs(Number(rawLc));
}

/** Classify Lc value into contrast level */
export function getContrastLevel(lc: number): ContrastLevel {
  if (lc >= 75) return 'AAA';   // Body text, any size
  if (lc >= 60) return 'AA';    // Body text, 18px+
  if (lc >= 45) return 'A';     // Large text, 24px+
  return 'Fail';
}
```

### contrast-matrix.ts — Pairwise APCA Matrix

```typescript
// lib/contrast-matrix.ts
import type { PaletteShade, ShadeStep } from "@/types/color";
import { getContrastFromHex } from "./contrast";

export interface ContrastMatrix {
  steps: ShadeStep[];
  values: number[][]; // values[row][col] = APCA Lc for text=row on bg=col
}

/** Build NxN pairwise APCA contrast matrix. Uses gamut-clamped .hex field.
 *  IMPORTANT: APCA is asymmetric — getContrast(a,b) ≠ getContrast(b,a).
 *  The matrix is NOT mirrored across the diagonal. */
export function buildContrastMatrix(shades: PaletteShade[]): ContrastMatrix {
  const steps = shades.map((s) => s.step);
  const values = shades.map((textShade) =>
    shades.map((bgShade) =>
      textShade === bgShade ? 0 : getContrastFromHex(textShade.hex, bgShade.hex)
    )
  );
  return { steps, values };
}
```

### ContrastGrid Component

`components/palette/contrast-grid.tsx` — NxN APCA contrast matrix rendered as a Lyse Table (compact mode).

Key implementation details:
- Uses `useDeferredValue` in `generator-shell.tsx` to decouple slider drag from matrix recompute
- Hover/focus on any cell shows a preview panel with sample text rendered in actual colors
- Click copies CSS pair (comment + color + background-color as OKLCH)
- Passing cells (Lc >= 60) get green tint, non-passing share muted background
- Rows = text color, columns = background color (APCA asymmetry preserved)
- Dynamic: works with any shade count (4-12)

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial load (LCP) | < 1.0s |
| Palette generation | < 100ms |
| Interaction (INP) | < 200ms |
| Bundle size (gzipped) | < 150KB |
| Lighthouse Performance | 100 |
| Lighthouse Accessibility | 100 |

### Optimizations

- **Tree-shake culori** — Import from `culori/fn`, register only `oklch` + `rgb` modes
- **Static palette data** — Tailwind/curated palettes as static imports (no runtime computation)
- **URL state** — No state management library needed
- **No backend** — Pure client-side, deploy to Vercel static

## Build Pipeline

```bash
# Install dependencies
npm install

# Development
npm run dev              # Next.js dev server on :3000

# Quality gates
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npx vitest               # Run all tests (141 cases)
npm run build            # Next.js production build

# Deploy
# Push to main → Vercel auto-deploys
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^16",
    "react": "^19",
    "react-dom": "^19",
    "culori": "^4",
    "apca-w3": "^0.1",
    "class-variance-authority": "^0.7",
    "@radix-ui/react-tabs": "^1",
    "@radix-ui/react-tooltip": "^1",
    "@radix-ui/react-select": "^2",
    "@radix-ui/react-dropdown-menu": "^2",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "vitest": "^3",
    "eslint": "^9",
    "eslint-config-next": "^15",
    "@types/react": "^19",
    "@types/node": "^22"
  }
}
```

## Local Development Setup

```bash
# 1. Clone
git clone https://github.com/maximepodgorski/magiklch.git
cd magiklch

# 2. Install
npm install

# 3. Install Lyse Registry components
npx shadcn@latest init
npx shadcn@latest add https://ui.getlyse.com/r/button.json
# ... (see full list above)

# 4. Run dev server
npm run dev
# → http://localhost:3000
```
