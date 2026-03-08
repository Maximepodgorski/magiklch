# Engineering — Architecture & Implementation

## Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15.x | SSR, routing, file-based pages |
| UI | React | 19.x | Component rendering |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Components | Lyse Registry | latest | Pre-built UI components (shadcn pattern) |
| Color Engine | culori | 4.x | Color parsing, conversion, gamut mapping |
| Contrast | apcach | 0.5.x | APCA contrast calculation in OKLCH |
| Language | TypeScript | 5.x | Type safety |

## File Tree

```
oklch-generator/
├── app/
│   ├── layout.tsx              # Root layout (dark mode, fonts, metadata)
│   ├── page.tsx                # Generator page (/)
│   ├── catalogue/
│   │   └── page.tsx            # Catalogue page (/catalogue)
│   ├── random/
│   │   └── page.tsx            # Random palette page (/random)
│   └── globals.css             # Tailwind imports + CSS variables
├── components/
│   ├── ui/                     # Lyse Registry components (auto-installed)
│   │   ├── button.tsx
│   │   ├── button.css
│   │   ├── badge.tsx
│   │   ├── badge.css
│   │   ├── input.tsx
│   │   ├── input.css
│   │   ├── tabs.tsx
│   │   ├── tabs.css
│   │   ├── toast.tsx
│   │   ├── toast.css
│   │   ├── tooltip.tsx
│   │   ├── tooltip.css
│   │   ├── toggle.tsx
│   │   ├── toggle.css
│   │   ├── select.tsx
│   │   ├── select.css
│   │   ├── dropdown-menu.tsx
│   │   └── dropdown-menu.css
│   ├── palette/
│   │   ├── palette-grid.tsx    # Grid of 11 ShadeCards
│   │   ├── shade-card.tsx      # Single shade display
│   │   ├── color-input.tsx     # Color input field + format detection
│   │   ├── palette-header.tsx  # Palette name + actions (share, copy all)
│   │   └── format-toggle.tsx   # OKLCH / HEX / HSL / CSS var switcher
│   ├── catalogue/
│   │   ├── catalogue-grid.tsx  # Grid of palette previews
│   │   ├── palette-preview.tsx # Mini palette card for catalogue
│   │   └── catalogue-filter.tsx # Search + hue filter
│   ├── layout/
│   │   ├── header.tsx          # Nav + dark mode toggle
│   │   ├── footer.tsx          # Links, credits
│   │   └── theme-toggle.tsx    # Dark/light mode switch
│   └── shared/
│       ├── copy-button.tsx     # 1-click copy with toast
│       ├── gamut-badge.tsx     # sRGB/P3/Clamped indicator
│       └── contrast-badge.tsx  # APCA Lc badge (AAA/AA/A/Fail)
├── lib/
│   ├── color-engine.ts         # Core: generate palette from input
│   ├── color-parser.ts         # Parse any color format → OKLCH
│   ├── color-formatter.ts      # Format OKLCH → HEX/HSL/CSS var
│   ├── gamut.ts                # Gamut checking + mapping
│   ├── contrast.ts             # APCA contrast calculation
│   ├── curves.ts               # Lightness + chroma curves
│   └── utils.ts                # Clipboard, URL encoding, helpers
├── hooks/
│   ├── use-palette.ts          # Main palette state hook
│   ├── use-color-format.ts     # Format preference state
│   └── use-copy.ts             # Copy-to-clipboard hook with feedback
├── data/
│   ├── tailwind-palettes.ts    # 22 Tailwind v4 palettes (static data)
│   └── curated-palettes.ts     # Custom curated palettes
├── types/
│   └── color.ts                # All TypeScript interfaces
├── public/
│   └── og-image.png            # Open Graph image
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── docs/                       # This documentation
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
export type ShadeStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export const SHADE_STEPS: readonly ShadeStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

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
| `/` | `app/page.tsx` | Generator — input color, see 11 shades |
| `/catalogue` | `app/catalogue/page.tsx` | Browse Tailwind + curated palettes |
| `/random` | `app/random/page.tsx` | Random palette generator |

## State Management

### URL-First Architecture

All palette state lives in URL search params. No global state store needed.

```
https://oklch-generator.vercel.app/?h=259&c=0.214&l=0.623&name=blue
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
npx shadcn@latest add https://lyse-registry.vercel.app/r/button.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/badge.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/input.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/tabs.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/toast.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/tooltip.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/toggle.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/select.json
npx shadcn@latest add https://lyse-registry.vercel.app/r/dropdown-menu.json
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

### apcach — APCA Contrast

```typescript
// lib/contrast.ts
import { apcach, crToBg, apcachToCss } from 'apcach';

export function getContrastOnWhite(color: OklchColor): number {
  const cssColor = `oklch(${color.l} ${color.c} ${color.h})`;
  // Returns APCA Lc value (0-108)
  const result = apcach(crToBg('#ffffff', 0), color.c, color.h);
  // ... calculate actual Lc between the shade and white
  return Math.abs(lcValue);
}

export function getContrastLevel(lc: number): ContrastLevel {
  if (lc >= 90) return 'AAA';
  if (lc >= 60) return 'AA';
  if (lc >= 45) return 'A';
  return 'Fail';
}
```

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
npm run build            # Next.js production build

# Deploy
# Push to main → Vercel auto-deploys
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "culori": "^4",
    "apcach": "^0.5",
    "class-variance-authority": "^0.7",
    "@radix-ui/react-tabs": "^1",
    "@radix-ui/react-tooltip": "^1",
    "@radix-ui/react-toggle": "^1",
    "@radix-ui/react-select": "^2",
    "@radix-ui/react-dropdown-menu": "^2",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
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
git clone https://github.com/[org]/oklch-generator.git
cd oklch-generator

# 2. Install
npm install

# 3. Install Lyse Registry components
npx shadcn@latest init
npx shadcn@latest add https://lyse-registry.vercel.app/r/button.json
# ... (see full list above)

# 4. Run dev server
npm run dev
# → http://localhost:3000
```
