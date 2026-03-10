# MagicOK — Design Specification

Exported from `pencil-welcome-desktop.pen` for Claude Code implementation.

## Screenshots

Reference screens in `design-magic/`:

| File | Page |
|------|------|
| `Generator V3.png` | Generator (`/`) |
| `Generator V3-1.png` | Catalogue (`/catalogue`) |
| `Generator V3-2.png` | Shuffle (`/random`) |
| `Generator V3-3.png` | Palette Detail (`/catalogue/[palette]`) |
| `Generator V3-4.png` | Documentation (`/docs`) |

---

## Stack & Dependencies

- **Framework**: Next.js 15 + React 19 + Tailwind v4
- **UI Kit**: **Lyse Registry** (shadcn-style components) — ALL UI components (Button, Badge, Select, Input, Sidebar, etc.) MUST come from Lyse Registry. Do NOT use raw HTML or other UI libraries.
- **Icon Library**: **Boxicons Solid (bxs)** — `react-icons/bi` or direct SVG from https://github.com/box-icons/boxicons. Browse at https://icones.js.org/collection/bxs
- **Fonts**: DM Sans (headings) + Inter (body) via `next/font/google`
- **Color Engine**: `culori/fn` + `apca-w3`

---

## Global Layout

Every page follows this structure:

```
┌──────────────────────────────────────────────┐
│  Top Header (56px, full width)               │
├──────────┬───────────────────────────────────┤
│ Sidebar  │  Main Content                     │
│ (256px)  │  (fill remaining)                 │
│          │                                   │
│          │                                   │
│          │                                   │
│          │                                   │
├──────────┴───────────────────────────────────┤
│  Footer (56px, only on Generator & Detail)   │
└──────────────────────────────────────────────┘
```

- **Viewport**: 1440 x 900
- **Background**: `var(--background)` → `var(--background-base)`
- **Layout**: Vertical flex (header → body), body is horizontal flex (sidebar + main)

---

## Design Tokens (Lyse Registry)

### Token Architecture (3 layers)

```
Layer 1: Primitives         styles/lyse/root-{colors,typography,layout}.css
         (raw values)       --root-color-brand-500, --root-font-size-md, --root-space-4

Layer 2: Semantics          styles/lyse/semantic-{colors,global}.css
         (mode-aware)       --background-base, --text-base-strong (auto-flip in .dark)

Layer 3: Bridge + App       styles/lyse/shadcn-bridge.css + app/globals.css
         (integration)      --background, --primary → maps to Layer 2 tokens
```

**Rule**: Always use semantic tokens (Layer 2) or bridge tokens (Layer 3) in components. Use primitives only when no semantic token covers the case. Never use raw color values.

### Core Tokens (Bridge → Semantic)

All bridge tokens are defined once in `:root` — they auto-resolve in `.dark` because the underlying semantic tokens flip.

| Bridge Token | Lyse Semantic Source | Usage |
|-------------|---------------------|-------|
| `--background` | `var(--background-base)` | Page bg |
| `--foreground` | `var(--text-base-strong)` | Primary text, headings |
| `--muted` | `var(--background-neutral-faint-default)` | Muted backgrounds |
| `--muted-foreground` | `var(--text-base-moderate)` | Secondary/description text |
| `--border` | `var(--border-default)` | Borders, dividers |
| `--input` | `var(--border-default)` | Input borders |
| `--ring` | `var(--border-selected)` | Focus rings |
| `--primary` | `var(--background-brand-strong-default)` | Primary buttons bg |
| `--primary-foreground` | `var(--root-color-base-white)` | Primary button text |
| `--secondary` | `var(--background-neutral-lighter-default)` | Secondary/theme pill bg |
| `--secondary-foreground` | `var(--text-base-strong)` | Secondary text |
| `--destructive` | `var(--background-danger-strong-default)` | Error/destructive actions |
| `--destructive-foreground` | `var(--root-color-base-white)` | Destructive text |
| `--card` | `var(--background-elevated)` | Card backgrounds |
| `--card-foreground` | `var(--text-base-strong)` | Card text |
| `--popover` | `var(--background-elevated)` | Popover/dropdown bg |
| `--popover-foreground` | `var(--text-base-strong)` | Popover text |
| `--accent` | `var(--background-neutral-lighter-default)` | Accent backgrounds |
| `--accent-foreground` | `var(--text-base-strong)` | Accent text |

### App-Level Tokens (globals.css)

Additional aliases used in existing components:

| App Token | Lyse Semantic Source | Tailwind class | Usage |
|-----------|---------------------|----------------|-------|
| `--surface-primary` | `var(--background-elevated)` | `bg-surface-primary` | Cards, elevated surfaces |
| `--surface-secondary` | `var(--background-neutral-lighter-default)` | `bg-surface-secondary` | Muted surface areas |
| `--content-primary` | `var(--text-base-strong)` | `text-content-primary` | Primary text |
| `--content-secondary` | `var(--text-base-moderate)` | `text-content-secondary` | Secondary text |
| `--border-secondary` | `var(--border-divider)` | `border-border-secondary` | Subtle borders, dividers |

### Sidebar Tokens (Bridge → Semantic)

| Bridge Token | Lyse Semantic Source | Usage |
|-------------|---------------------|-------|
| `--sidebar` | `var(--background-base)` | Sidebar bg |
| `--sidebar-foreground` | `var(--text-base-strong)` | Sidebar text |
| `--sidebar-border` | `var(--border-divider)` | Sidebar border |
| `--sidebar-accent` | `var(--background-neutral-lighter-default)` | Active item bg |
| `--sidebar-accent-foreground` | `var(--text-base-strong)` | Active item text |
| `--sidebar-primary` | `var(--background-brand-strong-default)` | Sidebar primary |
| `--sidebar-primary-foreground` | `var(--root-color-base-white)` | Sidebar primary text |
| `--sidebar-ring` | `var(--border-selected)` | Sidebar focus ring |

### Radius Tokens

| Lyse Token | Primitive | Value | Usage |
|-----------|-----------|-------|-------|
| `--layout-radius-xs` | `--root-radius-1` | 2px | Subtle rounding |
| `--layout-radius-sm` | `--root-radius-2` | 4px | Small elements |
| `--layout-radius-md` | `--root-radius-3` | 6px | Inputs, small cards |
| `--layout-radius-lg` | `--root-radius-4` | 8px | Buttons, badges |
| `--layout-radius-xl` | `--root-radius-5` | 12px | Cards, swatches |
| `--layout-radius-2xl` | `--root-radius-6` | 16px | Sections, containers |
| `--layout-radius-3xl` | `--root-radius-7` | 24px | Large panels |
| `--layout-radius-full` | `--root-radius-full` | 999px | Pills, circles |

### Gap Tokens

| Lyse Token | Primitive | Value | Usage |
|-----------|-----------|-------|-------|
| `--layout-gap-xs` | `--root-space-1` | 2px | Sidebar nav items |
| `--layout-gap-sm` | `--root-space-2` | 4px | Header actions |
| `--layout-gap-md` | `--root-space-4` | 8px | Swatch gap, palette strip |
| `--layout-gap-lg` | `--root-space-5` | 12px | Card internal, badges row |
| `--layout-gap-xl` | `--root-space-6` | 16px | Grid gap, card pairs |
| `--layout-gap-2xl` | `--root-space-7` | 24px | Controls gap |
| `--layout-gap-3xl` | `--root-space-8` | 32px | Slider row gap |
| `--layout-gap-4xl` | `--root-space-9` | 40px | Docs content padding |

### Padding Tokens

| Lyse Token | Primitive | Value | Usage |
|-----------|-----------|-------|-------|
| `--layout-padding-xs` | `--root-space-2` | 4px | Small internal padding |
| `--layout-padding-sm` | `--root-space-3` | 6px | Theme pill (3px × 2) |
| `--layout-padding-md` | `--root-space-4` | 8px | Sidebar bottom links |
| `--layout-padding-lg` | `--root-space-5` | 12px | Sidebar nav, cell padding |
| `--layout-padding-xl` | `--root-space-6` | 16px | Cell padding |
| `--layout-padding-2xl` | `--root-space-7` | 24px | Card padding, section padding |
| `--layout-padding-3xl` | `--root-space-8` | 32px | Page header top |
| `--layout-padding-4xl` | `--root-space-9` | 40px | Page header sides, docs padding |

### Font Tokens

| Lyse Token | Primitive | Value | Usage |
|-----------|-----------|-------|-------|
| `--font-family-heading` | `--root-font-family-primary` | DM Sans | Headings, titles |
| `--font-family-content` | `--root-font-family-secondary` | Inter | Body, labels |
| `--font-size-content-caption` | `--root-font-size-xs` | 12px | Code, small labels |
| `--font-size-content-note` | `--root-font-size-sm` | 14px | Body, descriptions, labels |
| `--font-size-content-body` | `--root-font-size-md` | 16px | Hero body text |
| `--font-size-content-highlight` | `--root-font-size-lg` | 18px | Card titles |
| `--font-size-content-feature` | `--root-font-size-xl` | 20px | Feature text |
| `--font-size-heading-small` | `--root-font-size-xl` | 20px | — |
| `--font-size-heading-medium` | `--root-font-size-2xl` | 24px | Section titles |
| `--font-size-heading-large` | `--root-font-size-3xl` | 30px | — |
| `--font-size-heading-display` | `--root-font-size-4xl` | 36px | Hero title |
| `--font-weight-regular` | `--root-font-weight-400` | 400 | Body text |
| `--font-weight-accent` | `--root-font-weight-500` | 500 | Labels, table headers |
| `--font-weight-emphasis` | `--root-font-weight-600` | 600 | Page titles, card titles |
| `--font-weight-bold` | `--root-font-weight-700` | 700 | Hero title, card letters |

**Note**: Design spec uses 22px for page titles and 40px for card big letters. No exact Lyse tokens exist for these sizes. Use custom values or closest tokens (`--font-size-heading-small` = 20px, `--font-size-heading-display` = 36px).

### Theme Support

The design supports Light and Dark modes. Lyse Registry also supports:
- **Base**: Neutral (default), Gray, Stone, Zinc, Slate
- **Accent**: Default, Red, Rose, Orange, Green, Blue, Yellow, Violet

For MagicOKLCH, use **Neutral base** with **Default accent**.

---

## Lyse Registry Components Used

All UI primitives come from Lyse Registry (`components/ui/`). The following are used in this design:

| Design Element | Lyse Component |
|---------------|----------------|
| Primary buttons ("Copy Variables", "Shuffle") | `Button` (default variant) |
| Secondary buttons ("Open in Generator") | `Button` (outline variant) |
| Icon buttons (GitHub, Link) | `Button` (outline variant, icon-only) |
| Badges ("CSS Color Level 4", "HSL", etc.) | `Badge` (outline / secondary / destructive variants) |
| Format dropdown | `Select` (filled variant) |
| Search input | `Input` (filled variant) |
| Source filter dropdown | `Select` (filled variant) |
| Sidebar nav items | `SidebarItem` (active / default variants) |
| Sidebar section title | `SidebarSectionTitle` |

---

## Components

### Component: Top Header

- **Height**: 56px, full width
- **Padding**: `0 var(--layout-padding-2xl)` (0 20px — note: 20px = 1.25rem, between `--layout-padding-xl` 16px and `--layout-padding-2xl` 24px)
- **Background**: `var(--background)`
- **Border-bottom**: `var(--layout-border-thin)` `var(--border)`
- **Layout**: Horizontal, `justify-content: space-between`, `align-items: center`

**Left**: Logo (sparkle icon in rounded square + "MagicOK" text)
- Logo icon: 24x24 sparkle path in a frame
- Text: "MagicOK" (rendered as SVG/logo)

**Right**: Actions group (horizontal, gap: `var(--layout-gap-sm)`)
- Theme Pill (see below) — sun, moon, desktop
- Sidebar toggle icon button (outline style, rightmost) — collapses/expands sidebar

### Component: Theme Pill

- **Shape**: Pill (`border-radius: var(--layout-radius-full)`)
- **Background**: `var(--secondary)`
- **Padding**: 3px
- **Layout**: Horizontal, `align-items: center`
- **Contains 3 circular buttons** (30x30px, `border-radius: var(--layout-radius-full)`):
  1. **Sun** (active): `bg: var(--background)`, icon: `bxs-sun` (14px), color: `var(--foreground)`
  2. **Moon**: no bg, icon: `bxs-moon`, color: `var(--muted-foreground)`
  3. **System**: no bg, icon: `bx-desktop`, color: `var(--muted-foreground)`

### Component: App Sidebar

- **Width**: 256px, full height of body
- **Background**: `var(--sidebar)`
- **Border-right**: `var(--layout-border-thin)` `var(--sidebar-border)`
- **Clip**: true
- **Padding**: 0 (padding is on child frames)
- **Layout**: Vertical flex

**Top section** (`navSlot`):
- Padding: `var(--layout-padding-lg)` (12px)
- Gap: `var(--layout-gap-xs)` (2px)
- Vertical layout, `height: fill`
- Nav items (each `width: fill`):
  - **Generator** — icon: `bxs-palette`, label: "Generator"
  - **Catalogue** — icon: `bxs-grid-alt`, label: "Catalogue"
  - **Shuffle** — icon: `bx-shuffle`, label: "Shuffle"
- Active item uses `Sidebar Item/Active` style, others use `Sidebar Item/Default`
- All items: trailing chevron hidden

**Bottom section** (`bottomSection`):
- Padding: 0
- **Divider**: `var(--layout-border-thin)`, `var(--border)`, full width
- **Links wrap**: padding `var(--layout-padding-md) var(--layout-padding-lg) var(--layout-padding-lg) var(--layout-padding-lg)`, vertical, gap: `var(--layout-gap-xs)`
  - **Docs** — icon: `bxs-book-open`, label: "Docs"
  - **LinkedIn** — icon: `bxl-linkedin-square`, label: "LinkedIn"

### Component: Export Footer

- **Height**: 56px, full width
- **Padding**: `0 20px`
- **Background**: `var(--background)`
- **Border-top**: `var(--layout-border-thin)` `var(--border)`
- **Layout**: Horizontal, `justify-content: flex-end`, `align-items: center`, gap: `var(--layout-gap-md)`

**Contents**:
- Format select dropdown (width: 140px, label hidden, value: "CSS")
- "Copy Variables" button (Default style, icon hidden)

---

## Pages

### 1. Generator (`/`)

**Sidebar**: Generator = active

**Page Header** (padding: `var(--layout-padding-3xl) var(--layout-padding-4xl) 20px var(--layout-padding-4xl)`):
- Icon: `bxs-palette` (22px) in 44x44 rounded square (`border-radius: 10px`, bg: `var(--background)`)
- Title: "Generator" (`--font-family-heading` 22px, `--font-weight-emphasis`)
- Subtitle: "Generate OKLCH palettes with APCA contrast scoring." (`--font-family-content` `--font-size-content-note`, `var(--muted-foreground)`)

**Divider**: `var(--layout-border-thin)`, `var(--border)`, full width

**Inner Content** (padding: `28px var(--layout-padding-4xl) 0 var(--layout-padding-4xl)`, gap: 28px):

1. **Controls Row** (horizontal, gap: `var(--layout-gap-2xl)`):
   - **Seed Color**: Label "Seed Color" (`--font-family-content` 13px `--font-weight-accent`), color swatch (32x32, rounded, fill: #3b82f6) + input (value: "#3B82F6")
   - **Shades**: Label + select dropdown (value: "9") — configurable shade count
   - **Gamut**: Label + select dropdown (value: "sRGB") — sRGB / Display P3 filter

2. **Sliders Row** (horizontal, gap: `var(--layout-gap-3xl)`, `align-items: center`):
   - **Lightness**: Label "Lightness" + value badge "62 %" + slider (blue-to-white gradient track)
   - **Chroma**: Label "Chroma" + value badge "0.208 C" + slider (gray-to-blue gradient track)
   - **Hue**: Label "Hue" + value badge "260" + slider (**rainbow gradient track** — full hue wheel)
   - Value badges: right-aligned, rounded, `var(--muted)` bg, monospace

3. **Palette Grid** (horizontal, gap: `var(--layout-gap-md)`, padding: `var(--layout-padding-md) 0`):
   - N swatches (count from Shades dropdown, default 9), each `border-radius: var(--layout-radius-xl)`, height: ~116px, `width: fill` (equal distribution)
   - Swatches only — no labels, no values visible (values via copy-on-click or footer export)

**Footer**: Export Footer component

---

### 2. Catalogue (`/catalogue`)

**Sidebar**: Catalogue = active

**Page Header** (padding: `var(--layout-padding-3xl) var(--layout-padding-4xl) 20px var(--layout-padding-4xl)`):
- Icon: `bxs-grid-alt` (22px) in 44x44 rounded square (bg: `var(--muted)`)
- Title: "Catalogue" (`--font-family-heading` 22px, `--font-weight-emphasis`)
- Subtitle: "Browse Tailwind-inspired and curated OKLCH palettes." (`--font-family-content` `--font-size-content-note`)

**Divider**: `var(--layout-border-thin)`

**Inner Content** (padding: `28px var(--layout-padding-4xl) 0 var(--layout-padding-4xl)`, gap: 28px):

1. **Filter Row** (horizontal, gap: `var(--layout-gap-lg)`, `align-items: center`):
   - Search input (filled style, placeholder: "Search palettes...", `width: fill`)
   - Source select (filled, value: "All", width: 160px, label hidden)

2. **Palette Grid** (3-column layout, gap: `var(--layout-gap-xl)`):
   - Each column: vertical, gap: `var(--layout-gap-xl)`
   - Each palette card contains:
     - **Continuous color strip** (horizontal, no gaps between shade segments — flush edge-to-edge, `border-radius: var(--layout-radius-xl)`, clip: true, height: ~40px)
     - Below strip: palette name (left-aligned) + source badge "Tailwind" or "Curated" (right-aligned), on the same line

**No footer**

---

### 3. Shuffle (`/random`)

**Sidebar**: Shuffle = active

**Page Header** (padding: `var(--layout-padding-3xl) var(--layout-padding-4xl) 20px var(--layout-padding-4xl)`, horizontal, `space-between`, `align-items: end`):

**Left** (`leftWrap`, vertical, gap: `var(--layout-gap-lg)`):
- Icon: `bx-shuffle` (22px) in 44x44 rounded square
- Title: "Shuffle" (`--font-family-heading` 22px, `--font-weight-emphasis`)
- Subtitle: "Discover random OKLCH palettes for inspiration."

**Right** (horizontal, gap: `var(--layout-gap-md)`):
- "Open in Generator" button (Outline style, icon hidden)
- Link icon button (Outline style, `bx-link`)

**Divider**: `var(--layout-border-thin)`

**Inner Content** (padding: `28px var(--layout-padding-4xl) 0 var(--layout-padding-4xl)`, gap: 28px):

1. **Palette Info** (horizontal, gap: `var(--layout-gap-2xl)`, `align-items: center`):
   - Hue info: label "Hue" + value (e.g. "237°")
   - Chroma info: label "Chroma" + value (e.g. "0.196")
   - Description badge (Outline): e.g. "Cool blue, medium saturation"

2. **Palette Strip** (horizontal, gap: `var(--layout-gap-md)`, padding: `var(--layout-padding-md) 0`):
   - 9 swatches, same style as Generator (rounded, equal width, ~100px height)

**Footer** (56px, `justify-content: flex-end`, padding: `0 20px`, border-top: `var(--layout-border-thin)` `var(--border)`):
- "Shuffle" button (Default/Primary style)

---

### 4. Palette Detail (`/catalogue/[palette]`)

**Sidebar**: Catalogue = active

**Page Header** (padding: `var(--layout-padding-3xl) var(--layout-padding-4xl) 20px var(--layout-padding-4xl)`, horizontal, `space-between`, `align-items: end`):

**Left** (`leftWrap`, vertical, gap: `var(--layout-gap-lg)`):
- Color square: 32x32 rounded rect filled with palette's base color (e.g. `#3b82f6`), `border-radius: var(--layout-radius-md)`
- Title: Palette name, e.g. "Blue" (`--font-family-heading` 22px, `--font-weight-emphasis`)
- Subtitle: e.g. "Tailwind-inspired · 12 shades" (`--font-family-content` `--font-size-content-note`, `var(--muted-foreground)`)

**Right** (`rightGroup`, horizontal, gap: `var(--layout-gap-md)`):
- "Open in Generator" button (Outline, icon hidden)
- Link icon button (Outline, `bx-link`)

**Divider**: `var(--layout-border-thin)`

**Inner Content** (padding: `28px var(--layout-padding-4xl) 0 var(--layout-padding-4xl)`, gap: `var(--layout-gap-xl)`):

1. **Color Grid** (4 columns × 3 rows = **12 shades**, gap: `var(--layout-gap-lg)`):
   - Each swatch: rounded rectangle (`border-radius: var(--layout-radius-xl)`), `width: fill`, height: ~130px
   - **OKLCH value label overlaid** on each swatch, bottom-left, inside a semi-transparent chip
   - Label: `oklch(L C H)` format, `--font-size-content-caption`, monospace
   - Label text color auto-adjusts for contrast: dark text on light swatches, light text on dark swatches
   - Light shades (top row): dark text, no chip bg needed
   - Dark shades (bottom rows): light text in a subtle dark chip for readability

**Footer**: Export Footer component

---

### 5. Documentation (`/docs`)

**Sidebar**: Docs = active (in bottom section)

**Page Header** (padding: `var(--layout-padding-3xl) var(--layout-padding-4xl) 20px var(--layout-padding-4xl)`):
- Icon: `bxs-book-open` (22px) in 44x44 rounded square
- Title: "Documentation" (`--font-family-heading` 22px, `--font-weight-emphasis`)
- Subtitle: "Everything you need to know about the OKLCH color space."

**Divider**: `var(--layout-border-thin)`

**Docs Content** (padding: `var(--layout-padding-4xl)`, gap: 48px, vertical, `width: fill`, clip: true):

#### Section 1: Hero
- Title: "What is OKLCH?" (`--font-family-heading` `--font-size-heading-display`, `--font-weight-bold`, `var(--foreground)`)
- Description: (`--font-family-content` `--font-size-content-body`, `var(--muted-foreground)`, lineHeight: 1.7)
  > "OKLCH is a perceptually uniform color space designed for the modern web. It gives designers and developers precise control over lightness, chroma, and hue — producing consistent, accessible palettes across every screen."
- Badges row (horizontal, gap: `var(--layout-gap-md)`):
  - "CSS Color Level 4" (Outline badge)
  - "Perceptually Uniform" (Outline badge)
  - "Wide Gamut" (Outline badge)

#### Section 2: Color Spectrum
- Full-width bar, height: 64px, `border-radius: var(--layout-radius-xl)`, clip: true
- 8 equal-width color segments: `#ef4444`, `#f97316`, `#eab308`, `#22c55e`, `#06b6d4`, `#3b82f6`, `#8b5cf6`, `#ec4899`

#### Section 3: The Three Channels
- Section title: "The three channels" (`--font-family-heading` `--font-size-heading-medium`, `--font-weight-emphasis`)
- 3 cards in a row (horizontal, gap: `var(--layout-gap-xl)`):

Each card:
- `width: fill`, vertical layout, gap: `var(--layout-gap-lg)`
- `padding: var(--layout-padding-2xl)`, `border-radius: var(--layout-radius-xl)`
- **Background**: `var(--card)`
- **Border**: `var(--layout-border-thin)` `var(--border)`

| Card | Letter | Title | Description |
|------|--------|-------|-------------|
| L | "L" (`--font-family-heading` 40px `--font-weight-bold`) | "Lightness" (`--font-family-heading` `--font-size-content-highlight` `--font-weight-emphasis`) | "0 (black) to 1 (white). Perceptually linear — a change of 0.1 always looks the same to the human eye." |
| C | "C" (`--font-family-heading` 40px `--font-weight-bold`) | "Chroma" (`--font-family-heading` `--font-size-content-highlight` `--font-weight-emphasis`) | "0 (gray) to ~0.37 (most vivid). Controls saturation intensity. Higher values push toward display gamut limits." |
| H | "H" (`--font-family-heading` 40px `--font-weight-bold`) | "Hue" (`--font-family-heading` `--font-size-content-highlight` `--font-weight-emphasis`) | "0° to 360° on the color wheel. Red ≈ 25°, Yellow ≈ 90°, Green ≈ 145°, Blue ≈ 265°, Purple ≈ 305°." |

#### Section 4: Why OKLCH over HSL?
- **No container card** — title + table directly on page background
- Title: "Why OKLCH over HSL?" (`--font-family-heading` `--font-size-heading-medium`, `--font-weight-emphasis`)
- **Table** (`border-radius: var(--layout-radius-xl)`, border: `var(--layout-border-thin)` `var(--border)`, clip: true):

| Feature | HSL | OKLCH |
|---------|-----|-------|
| Perceptual uniformity | No — same L value looks different across hues | Yes — L 0.7 looks equally bright at any hue |
| Gamut | sRGB only | Display P3, Rec. 2020 and beyond |
| Predictability | Hue shifts when adjusting lightness | Channels are independent — no hue shifts |
| Palette generation | Trial and error — no consistent results | Systematic — interpolate L and C curves |
| Browser support | Universal | All modern browsers (CSS Color Level 4) |

Table styling:
- Header row: bg `var(--card)`, text: `var(--muted-foreground)` (`--font-family-content` 13px `--font-weight-accent`)
- Feature column: width 200px, text: `var(--foreground)` (`--font-family-content` `--font-size-content-note` `--font-weight-accent`)
- HSL column: `fill`, text: `var(--muted-foreground)` (`--font-family-content` `--font-size-content-note`)
- OKLCH column: `fill`, text: `var(--foreground)` (`--font-family-content` `--font-size-content-note`)
- Cell padding: `var(--layout-padding-lg) var(--layout-padding-xl)`
- Row borders: bottom `var(--layout-border-thin)` `var(--border)`
- Column borders: left `var(--layout-border-thin)` `var(--border)` (except first column)

#### Section 5: See the Difference
- **No container card** — title + description + cards directly on page background
- Title: "See the difference" (`--font-family-heading` `--font-size-heading-medium`, `--font-weight-emphasis`)
- Description: (`--font-family-content` `--font-size-content-note`, `var(--muted-foreground)`, lineHeight: 1.6)
  > "Both examples below use the same lightness value within their color space. HSL produces drastically different perceived brightness, while OKLCH stays visually consistent."
- **Two cards** side by side (horizontal, gap: `var(--layout-gap-xl)`):

| Card | Badge | Description | Color 1 | Color 2 |
|------|-------|-------------|---------|---------|
| HSL | "HSL" (Secondary badge) | "Same L value (50%), drastically different perceived brightness." | `#FFFF00` (yellow) | `#0000FF` (blue) |
| OKLCH | "OKLCH" (Outline badge) | "Same L value (0.7), visually consistent brightness across hues." | `#C4A702` (muted yellow) | `#6B7CDB` (muted blue) |

Card styling:
- `width: fill`, vertical, gap: `var(--layout-gap-lg)`
- `padding: 20px`, `border-radius: var(--layout-radius-xl)`
- Background: `var(--background)`
- Border: `var(--layout-border-thin)` `var(--border)`
- Color strip: 32px height, `border-radius: var(--layout-radius-lg)`, clip, two equal rectangles

#### Section 6: Usage in CSS
- **No container card** — title + description + code block directly on page background
- Title: "Usage in CSS" (`--font-family-heading` `--font-size-heading-medium`, `--font-weight-emphasis`)
- Description: "OKLCH is natively supported in all modern browsers. Use it directly in your stylesheets." (`--font-family-content` `--font-size-content-note`)
- **Code block**: `border-radius: var(--layout-radius-xl)`, bg: `var(--background)`, border: `var(--layout-border-thin)` `var(--border)`, padding: `var(--layout-padding-2xl)`, gap: 6px

```css
:root {
  --color-primary: oklch(0.6 0.25 265);
  --color-secondary: oklch(0.7 0.15 145);
  --color-accent: oklch(0.8 0.2 30);
}
```

Syntax colors (light mode):
- Brackets/selectors (`:root {`, `}`): `var(--muted-foreground)`
- `--color-primary` line: `--root-color-brand-600`
- `--color-secondary` line: `--root-color-success-600`
- `--color-accent` line: `--root-color-warning-600`
- Font: Roboto Mono, `--font-size-content-caption`, lineHeight: 1.8

**No footer on Docs page**

---

## Typography

| Usage | Font Token | Size Token | Weight Token | Color Token |
|-------|-----------|------------|-------------|-------------|
| Page title | `--font-family-heading` | 22px (custom) | `--font-weight-emphasis` | `var(--foreground)` |
| Page subtitle | `--font-family-content` | `--font-size-content-note` (14px) | `--font-weight-regular` | `var(--muted-foreground)` |
| Section title | `--font-family-heading` | `--font-size-heading-medium` (24px) | `--font-weight-emphasis` | `var(--foreground)` |
| Hero title | `--font-family-heading` | `--font-size-heading-display` (36px) | `--font-weight-bold` | `var(--foreground)` |
| Body text | `--font-family-content` | `--font-size-content-note` (14px) | `--font-weight-regular` | `var(--muted-foreground)` |
| Hero body | `--font-family-content` | `--font-size-content-body` (16px) | `--font-weight-regular` | `var(--muted-foreground)` |
| Card big letter | `--font-family-heading` | 40px (custom) | `--font-weight-bold` | `var(--foreground)` |
| Card title | `--font-family-heading` | `--font-size-content-highlight` (18px) | `--font-weight-emphasis` | `var(--foreground)` |
| Card description | `--font-family-content` | `--font-size-content-note` (14px) | `--font-weight-regular` | `var(--muted-foreground)` |
| Code | Roboto Mono | `--font-size-content-caption` (12px) | `--font-weight-regular` | varies |
| Control label | `--font-family-content` | 13px (custom) | `--font-weight-accent` | `var(--foreground)` |
| Table header | `--font-family-content` | 13px (custom) | `--font-weight-accent` | `var(--muted-foreground)` |
| Table cell | `--font-family-content` | `--font-size-content-note` (14px) | varies | varies |

**Custom sizes without exact Lyse tokens**: 13px, 22px, 40px — define as app-level CSS variables or use closest token.

---

## Icon Library

**Boxicons Solid (bxs)** — https://icones.js.org/collection/bxs | https://github.com/box-icons/boxicons

All icons use the filled (solid) variant. Use `react-icons/bi` package or inline SVGs.

| Icon | Usage | Boxicons name |
|------|-------|---------------|
| Palette | Generator nav + header | `bxs-palette` |
| Grid | Catalogue nav + header | `bxs-grid-alt` |
| Shuffle | Shuffle nav + header | `bx-shuffle` (regular, no solid variant) |
| Book | Docs nav + header | `bxs-book-open` |
| LinkedIn | Sidebar bottom | `bxl-linkedin-square` |
| GitHub | Header action | `bxl-github` |
| Link | Share button | `bx-link` (regular) |
| Sun | Theme pill (light) | `bxs-sun` |
| Moon | Theme pill (dark) | `bxs-moon` |
| Desktop | Theme pill (system) | `bx-desktop` (regular) |

Note: Some icons only exist in regular (bx-) or logo (bxl-) variants. The design in Pencil used Phosphor/Material Symbols as placeholders — map to the closest Boxicons equivalent above.

---

## Spacing Patterns (Token Mapping)

| Context | Design Value | Lyse Token |
|---------|-------------|------------|
| Page header top | 32px | `--layout-padding-3xl` (2rem) |
| Page header sides | 40px | `--layout-padding-4xl` (2.5rem) |
| Page header bottom | 20px | 1.25rem (custom — between `--layout-padding-xl` 16px and `--layout-padding-2xl` 24px) |
| Inner content top | 28px | 1.75rem (custom — between `--layout-padding-2xl` 24px and `--layout-padding-3xl` 32px) |
| Inner content sides | 40px | `--layout-padding-4xl` (2.5rem) |
| Inner content gap | 28px | 1.75rem (custom — between `--layout-gap-2xl` 24px and `--layout-gap-3xl` 32px) |
| Docs content padding | 40px | `--layout-padding-4xl` |
| Docs section gap | 48px | 3rem (custom — `--root-space-10`) |
| Card padding | 20-24px | `--layout-padding-2xl` (24px) |
| Card gap (internal) | 12px | `--layout-gap-lg` |
| Controls gap | 24px | `--layout-gap-2xl` |
| Slider row gap | 32px | `--layout-gap-3xl` |
| Palette swatch gap | 8px | `--layout-gap-md` |
| Sidebar nav padding | 12px | `--layout-padding-lg` |
| Sidebar nav item gap | 2px | `--layout-gap-xs` |
| Header/footer inline padding | 20px | 1.25rem (custom) |
| Section container padding | 24px | `--layout-padding-2xl` |
| Section container radius | 16px | `--layout-radius-2xl` |

---

## Routes

| Route | Page | Footer | Screenshot |
|-------|------|--------|------------|
| `/` | Generator | Export Footer (CSS dropdown + Copy Variables) | `Generator V3.png` |
| `/catalogue` | Catalogue | None | `Generator V3-1.png` |
| `/random` | Shuffle | Shuffle button footer | `Generator V3-2.png` |
| `/catalogue/[palette]` | Palette Detail (12 shades, 4×3 grid) | Export Footer | `Generator V3-3.png` |
| `/docs` | Documentation (6 sections, scrollable) | None | `Generator V3-4.png` |
