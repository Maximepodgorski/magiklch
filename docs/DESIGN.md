# Design — UI/UX Specifications

## Design Principles

1. **The palette IS the UI** — Color swatches dominate the viewport. The generated palette is the hero, not chrome around it.
2. **Copy in 1 click** — Every color value is a copy target. Click → clipboard → toast. No modals, no selections.
3. **URL is always shareable** — Every state is encoded in the URL. No "save" or "export" step to share. Just copy the URL.
4. **Dark mode first** — Designed in dark mode, then adapted for light. Color work is better on dark backgrounds.
5. **Zero friction** — Landing on `/` shows a pre-generated palette immediately. No onboarding, no empty states.

## Pages & Wireframes

### 1. Generator (`/`)

The primary page. Input a color, get shades with tabs for swatches and contrast grid.

```
┌─────────────────────────────────────────────────────────────────┐
│  ☰  Magiklch                                        [◐] [GitHub] │
├────┬────────────────────────────────────────────────────────────┤
│    │  ⊕ Generator                                              │
│ N  │  Generate OKLCH palettes with APCA contrast scoring.      │
│ A  │                                                            │
│ V  │  Seed Color          Shades           Gamut                │
│    │  ┌──┐ #3b82f6        [12 ▾]           [sRGB ▾]            │
│    │                                                            │
│    │  ── L ━━━━━━━━━━━●━━━━━━━━━━ 65%                          │
│    │  ── C ━━━━━━●━━━━━━━━━━━━━━━ 0.214                        │
│    │  ── H ━━━━━━━━━━━━━━━●━━━━━ 259°                          │
│    │                                                            │
│    │  ┌─────────────────────────┐  [Preview in Blocks]         │
│    │  │ (Shades) │ Contrast    │                                │
│    │  └─────────────────────────┘                               │
│    │                                                            │
│    │  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐       │
│    │  │50 │100│200│300│400│500│600│700│800│900│950│975│       │
│    │  │   │   │   │   │   │   │   │   │   │   │   │   │       │
│    │  └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘       │
│    │                                                            │
│    │  ┌──────────────────────────────────────────────────┐      │
│    │  │  [CSS ▾]                           [Copy Values] │      │
│    │  └──────────────────────────────────────────────────┘      │
└────┴────────────────────────────────────────────────────────────┘
```

**Mobile (< 640px):** Grid collapses to 2 columns. Shade cards stack vertically.

### Contrast Tab

When the "Contrast" pill tab is active, the shade swatches are replaced by an NxN APCA contrast grid.

```
┌──────────────────────────────────────────────────────────────┐
│  Preview panel (fixed height, shows on hover/focus)          │
│  ┌─────────────────┐                                        │
│  │                  │  300 on 800                            │
│  │   Aa             │  Lc 72                                 │
│  │   The quick...   │  [Body text]                           │
│  │   12px caption   │                                        │
│  └─────────────────┘                                        │
├──────────────────────────────────────────────────────────────┤
│         │ 50  │ 100 │ 200 │ 300 │ ... │ 950 │ 975 │        │
│  Text\Bg├─────┼─────┼─────┼─────┼─────┼─────┼─────┤        │
│   50    │  —  │  8  │  14 │  28 │ ... │  97 │ 102 │        │
│  100    │  6  │  —  │  10 │  22 │ ... │  94 │  99 │        │
│  200    │ 12  │  8  │  —  │  15 │ ... │  88 │  94 │        │
│  ...    │     │     │     │     │     │     │     │        │
│  975    │ 103 │ 100 │  95 │  82 │ ... │  12 │  —  │        │
└──────────────────────────────────────────────────────────────┘
```

Cells show Lc value + label (Body/Large/Fail). Passing cells (Lc >= 60) highlighted green. Non-passing cells share muted background with diagonal. Click copies CSS pair as OKLCH.

### Shade Swatch

Each shade is a square swatch. Step number appears on hover. Click copies the OKLCH value. Tooltip shows the full `oklch(...)` string.

```
┌──────────────────────┐
│                      │  ← Color swatch (square, aspect-ratio 1)
│         500          │  ← Step label (visible on hover)
│                      │
└──────────────────────┘
```

Light shades (L > 0.85) get a thin border to differentiate from the background.

### 3. Catalogue (`/catalogue`)

Browse pre-built palettes.

```
┌──────────────────────────────────────────────────────────────┐
│  OKLCH Generator                    [Catalogue] [Random] [◐] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Palette Catalogue                                           │
│                                                              │
│  ┌──────────────────────────────┐                            │
│  │  Search palettes...          │  [Tailwind ▾] [All hues ▾] │
│  └──────────────────────────────┘                            │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Red              │  │ Orange           │  │ Amber        │ │
│  │ ██████████████  │  │ ██████████████  │  │ ████████████ │ │
│  │ tailwind        │  │ tailwind        │  │ tailwind     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Ocean            │  │ Dune             │  │ Void         │ │
│  │ ██████████████  │  │ ██████████████  │  │ ████████████ │ │
│  │ curated         │  │ curated         │  │ curated      │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Each palette card** shows a mini stripe of all 11 shades. Click → navigates to Generator with that palette's base color in URL params.

### 4. Random (`/random`)

```
┌──────────────────────────────────────────────────────────────┐
│  OKLCH Generator                    [Catalogue] [Random] [◐] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Random Palette                           [🔀 Shuffle]       │
│                                                              │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐  │
│  │ 50  │ 100 │ 200 │ 300 │ 400 │ 500 │ 600 │ 700 │ 800 │  │
│  │     │     │     │     │     │     │     │     │     │  │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘  │
│  ┌───────────┬───────────┐                                   │
│  │    900    │    950    │                                   │
│  └───────────┴───────────┘                                   │
│                                                              │
│  Hue: 237°  Chroma: 0.198                                   │
│                                                              │
│  [Open in Generator]  [Share]  [Copy All]                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Component Map

Mapping each UI element to its Lyse Registry component:

| UI Element | Lyse Component | Variant/Usage |
|------------|---------------|---------------|
| Color input field | `Input` | With color format detection |
| Random button | `Button` | `variant="outline"` |
| Share button | `Button` | `variant="outline"` + share icon |
| Copy All button | `Button` | `variant="default"` |
| Format selector | `Select` | OKLCH / HEX / HSL / CSS var |
| Shuffle button | `Button` | `variant="outline"` |
| Source filter | `Select` | Tailwind / Curated / All |
| Hue filter | `Select` | Warm / Cool / Neutral / All |
| Contrast badge | `Badge` | AAA=green, AA=yellow, A=orange, Fail=red |
| Gamut badge | `Badge` | P3=purple, Clamped=orange |
| Palette source label | `Tag` | tailwind / curated / generated |
| Copy confirmation | `Toast` | "Copied oklch(0.623 0.214 259)" |
| Color value tooltip | `Tooltip` | Full OKLCH breakdown on hover |
| Dark mode toggle | `Toggle` | Sun/moon icon toggle |
| Navigation tabs | `Tabs` | Generator / Catalogue / Random |
| Shade card | Custom component | Uses Badge, Tooltip, copy interaction |
| Palette preview | Custom component | Mini stripe for catalogue grid |
| Contrast matrix table | `Table` (Lyse, compact) | NxN APCA grid with hover/focus states |
| Shade/Contrast switcher | `Tabs` | `variant="pill" size="md"` |
| Scale selector | `Select` | 4 / 6 / 8 / 10 / 11 / 12 shades |
| Gamut selector | `Select` | sRGB / Display P3 |
| L/C/H sliders | Custom component | Range inputs with live preview |
| Contrast grid | Custom component | Uses Table, builds NxN APCA matrix |

### Components NOT from Lyse Registry (custom)

| Component | Reason |
|-----------|--------|
| `ShadeCard` | Domain-specific: swatch + data + copy interactions |
| `PaletteGrid` | Domain-specific: 11-shade grid layout |
| `PalettePreview` | Domain-specific: mini stripe visualization |
| `ColorInput` | Custom: format detection + color preview dot |
| `CopyButton` | Wraps `Button` with clipboard logic + toast |
| `GamutBadge` | Wraps `Badge` with gamut-specific colors |
| `ContrastBadge` | Wraps `Badge` with APCA-specific colors |
| `ContrastGrid` | Domain-specific: NxN APCA matrix with hover preview + copy |
| `LchSliders` | Custom: 3 range sliders for Lightness/Chroma/Hue |
| `GeneratorShell` | Orchestrator: assembles all generator UI pieces |

## Interaction Patterns

### Copy Flow

```
User clicks color value
    │
    ├─► Clipboard API writes value
    │
    ├─► Toast appears: "Copied #3b82f6" (2s auto-dismiss)
    │
    └─► Button shows checkmark icon briefly (300ms)
```

### Share Flow

```
User clicks [Share]
    │
    ├─► URL is already up-to-date (URL-first state)
    │
    ├─► Clipboard API writes current URL
    │
    └─► Toast: "Link copied to clipboard"
```

### Format Toggle

```
User selects format from dropdown (Select)
    │
    ├─► All ShadeCard values update to new format
    │
    ├─► Preference saved to localStorage
    │
    └─► Copy actions use new format
```

### Random Generation

```
User clicks [Shuffle] or visits /random
    │
    ├─► Generate random hue (0-360)
    │
    ├─► Generate random chroma (0.08-0.25) — avoid extremes
    │
    ├─► URL updates with new params
    │
    └─► Palette regenerates instantly
```

### Contrast Grid

```
User hovers/focuses cell [row, col]
    │
    ├─► Preview panel shows sample text in text=shades[row] on bg=shades[col]
    │
    ├─► Cell gets ring-2 ring-inset highlight
    │
    └─► On mouse leave/blur: preview resets to placeholder

User clicks cell [row, col]
    │
    ├─► CSS pair copied: color + background-color as OKLCH values
    │
    └─► Toast: "Copied contrast pair"
```

## Responsive Strategy

### Breakpoints

| Breakpoint | Width | Grid columns | Layout changes |
|-----------|-------|-------------|----------------|
| `sm` | < 640px | 2 | Cards stack, compact values |
| `md` | 640–1024px | 3-4 | Standard grid |
| `lg` | 1024–1280px | 5-6 | Comfortable spacing |
| `xl` | > 1280px | Full 11 | Single row |

### Grid Behavior

```
xl (≥1280px):   [ 50 ][ 100 ][ 200 ][ 300 ][ 400 ][ 500 ][ 600 ][ 700 ][ 800 ][ 900 ][ 950 ]

lg (1024-1280):  [ 50 ][ 100 ][ 200 ][ 300 ][ 400 ][ 500 ]
                 [ 600 ][ 700 ][ 800 ][ 900 ][ 950 ]

md (640-1024):   [ 50 ][ 100 ][ 200 ][ 300 ]
                 [ 400 ][ 500 ][ 600 ][ 700 ]
                 [ 800 ][ 900 ][ 950 ]

sm (<640px):     [ 50 ][ 100 ]
                 [ 200 ][ 300 ]
                 [ 400 ][ 500 ]
                 [ 600 ][ 700 ]
                 [ 800 ][ 900 ]
                 [ 950 ]
```

### Mobile Adaptations

- Color input: full width
- Shade swatches: simplified — square swatch + step on hover (tap to copy)
- Catalogue grid: 1 column
- Actions: bottom bar instead of inline

## Dark Mode

### Behavior

1. **Default:** Follow system preference (`prefers-color-scheme`)
2. **Manual toggle:** Override via Toggle component in header
3. **Persistence:** Save preference in `localStorage`

### Implementation

Uses 3-layer CSS token system (see CLAUDE.md). Semantic tokens auto-flip in `.dark {}` blocks via `next-themes` with `attribute='class'`.

### Color Swatch Rendering

Shade swatches always render at their actual color regardless of theme. The surrounding UI (cards, text, borders) adapts. This ensures the palette preview is always accurate.

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between shade swatches and actions |
| `Enter` / `Space` | Copy color value on focused shade swatch |
| `Escape` | Dismiss toast / close dropdowns |

### ARIA

```tsx
// ContrastBadge
<span
  role="status"
  aria-label={`APCA contrast level: ${level}`}
>
  {level}
</span>

// GamutBadge
<span
  role="status"
  aria-label={`Color gamut: ${gamut === 'p3' ? 'P3 only' : 'sRGB safe'}`}
>
  {gamut === 'p3' ? 'P3' : null}
</span>
```

### Focus Management

- Visible focus rings on all interactive elements (Tailwind `ring-*` utilities)
- Focus trapped inside dropdowns/modals when open
- Skip-to-content link for keyboard users
- Toast announcements via `aria-live="polite"`

### Color Contrast

All UI text meets APCA Lc 75+ (the app's own UI, not the generated palettes). We practice what we preach.

## Motion & Animation

Keep animations minimal — the content (colors) should be static and precise.

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Toast enter | Slide up + fade in | 200ms | `ease-out` |
| Toast exit | Fade out | 150ms | `ease-in` |
| Copy checkmark | Scale in | 200ms | `spring` |
| Format toggle | Crossfade values | 150ms | `ease-in-out` |
| Shade card hover | Slight lift + shadow | 150ms | `ease-out` |
| Page transitions | None (instant) | — | — |
| Palette generation | None (instant) | — | — |

No loading spinners — palette generation is synchronous and < 100ms.
