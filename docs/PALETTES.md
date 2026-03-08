# Palettes — Data & Curation

## Data Structure

```typescript
// data/tailwind-palettes.ts | data/curated-palettes.ts

import type { Palette, PaletteShade, ShadeStep, OklchColor } from '@/types/color';

/**
 * Static palette data.
 * Each palette has 11 shades with pre-computed OKLCH values.
 * HEX values are derived at build/import time via culori.
 */
export interface StaticPalette {
  id: string;
  name: string;
  source: 'tailwind' | 'curated' | 'generated' | 'random';
  shades: Record<ShadeStep, OklchColor>;
}
```

## Source Types

| Type | Count | Origin | Editable |
|------|-------|--------|----------|
| `tailwind` | 22 | Tailwind CSS v4 official | No (reference data) |
| `curated` | 5-8 | Hand-crafted custom palettes | No (shipped with app) |
| `generated` | ∞ | User input on Generator page | Yes (URL params) |
| `random` | ∞ | Random generation | Yes (shuffle) |

## Tailwind v4 Palettes (22 Families)

All values sourced from the official [Tailwind CSS v4 theme.css](https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css).

### Red

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97.1% 0.013 17.38)` | `--color-red-50` |
| 100 | `oklch(93.6% 0.032 17.717)` | `--color-red-100` |
| 200 | `oklch(88.5% 0.062 18.334)` | `--color-red-200` |
| 300 | `oklch(80.8% 0.114 19.571)` | `--color-red-300` |
| 400 | `oklch(70.4% 0.191 22.216)` | `--color-red-400` |
| 500 | `oklch(63.7% 0.237 25.331)` | `--color-red-500` |
| 600 | `oklch(57.7% 0.245 27.325)` | `--color-red-600` |
| 700 | `oklch(50.5% 0.213 27.518)` | `--color-red-700` |
| 800 | `oklch(44.4% 0.177 26.899)` | `--color-red-800` |
| 900 | `oklch(39.6% 0.141 25.723)` | `--color-red-900` |
| 950 | `oklch(25.8% 0.092 26.042)` | `--color-red-950` |

### Orange

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98% 0.016 73.684)` | `--color-orange-50` |
| 100 | `oklch(95.4% 0.038 75.164)` | `--color-orange-100` |
| 200 | `oklch(90.1% 0.076 70.697)` | `--color-orange-200` |
| 300 | `oklch(83.7% 0.128 66.29)` | `--color-orange-300` |
| 400 | `oklch(75% 0.183 55.934)` | `--color-orange-400` |
| 500 | `oklch(70.5% 0.213 47.604)` | `--color-orange-500` |
| 600 | `oklch(64.6% 0.222 41.116)` | `--color-orange-600` |
| 700 | `oklch(55.3% 0.195 38.402)` | `--color-orange-700` |
| 800 | `oklch(47% 0.157 37.304)` | `--color-orange-800` |
| 900 | `oklch(40.8% 0.123 38.172)` | `--color-orange-900` |
| 950 | `oklch(26.6% 0.079 36.259)` | `--color-orange-950` |

### Amber

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.7% 0.022 95.277)` | `--color-amber-50` |
| 100 | `oklch(96.2% 0.059 95.617)` | `--color-amber-100` |
| 200 | `oklch(92.4% 0.12 95.746)` | `--color-amber-200` |
| 300 | `oklch(87.9% 0.169 91.605)` | `--color-amber-300` |
| 400 | `oklch(82.8% 0.189 84.429)` | `--color-amber-400` |
| 500 | `oklch(76.9% 0.188 70.08)` | `--color-amber-500` |
| 600 | `oklch(66.6% 0.179 58.318)` | `--color-amber-600` |
| 700 | `oklch(55.5% 0.163 48.998)` | `--color-amber-700` |
| 800 | `oklch(47.3% 0.137 46.201)` | `--color-amber-800` |
| 900 | `oklch(41.4% 0.112 45.904)` | `--color-amber-900` |
| 950 | `oklch(27.9% 0.077 45.635)` | `--color-amber-950` |

### Yellow

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.7% 0.026 102.212)` | `--color-yellow-50` |
| 100 | `oklch(97.3% 0.071 103.193)` | `--color-yellow-100` |
| 200 | `oklch(94.5% 0.129 101.54)` | `--color-yellow-200` |
| 300 | `oklch(90.5% 0.182 98.111)` | `--color-yellow-300` |
| 400 | `oklch(85.2% 0.199 91.936)` | `--color-yellow-400` |
| 500 | `oklch(79.5% 0.184 86.047)` | `--color-yellow-500` |
| 600 | `oklch(68.1% 0.162 75.834)` | `--color-yellow-600` |
| 700 | `oklch(55.4% 0.135 66.442)` | `--color-yellow-700` |
| 800 | `oklch(47.6% 0.114 61.907)` | `--color-yellow-800` |
| 900 | `oklch(42.1% 0.095 57.708)` | `--color-yellow-900` |
| 950 | `oklch(28.6% 0.066 53.813)` | `--color-yellow-950` |

### Lime

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.6% 0.031 120.757)` | `--color-lime-50` |
| 100 | `oklch(96.7% 0.067 122.328)` | `--color-lime-100` |
| 200 | `oklch(93.8% 0.127 124.321)` | `--color-lime-200` |
| 300 | `oklch(89.7% 0.196 126.665)` | `--color-lime-300` |
| 400 | `oklch(84.1% 0.238 128.85)` | `--color-lime-400` |
| 500 | `oklch(76.8% 0.233 130.85)` | `--color-lime-500` |
| 600 | `oklch(64.8% 0.2 131.684)` | `--color-lime-600` |
| 700 | `oklch(53.2% 0.157 131.589)` | `--color-lime-700` |
| 800 | `oklch(45.3% 0.124 130.933)` | `--color-lime-800` |
| 900 | `oklch(40.5% 0.101 131.063)` | `--color-lime-900` |
| 950 | `oklch(27.4% 0.072 132.109)` | `--color-lime-950` |

### Green

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.2% 0.018 155.826)` | `--color-green-50` |
| 100 | `oklch(96.2% 0.044 156.743)` | `--color-green-100` |
| 200 | `oklch(92.5% 0.084 155.995)` | `--color-green-200` |
| 300 | `oklch(87.1% 0.15 154.449)` | `--color-green-300` |
| 400 | `oklch(79.2% 0.209 151.711)` | `--color-green-400` |
| 500 | `oklch(72.3% 0.219 149.579)` | `--color-green-500` |
| 600 | `oklch(62.7% 0.194 149.214)` | `--color-green-600` |
| 700 | `oklch(52.7% 0.154 150.069)` | `--color-green-700` |
| 800 | `oklch(44.8% 0.119 151.328)` | `--color-green-800` |
| 900 | `oklch(39.3% 0.095 152.535)` | `--color-green-900` |
| 950 | `oklch(26.6% 0.065 152.934)` | `--color-green-950` |

### Emerald

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97.9% 0.021 166.113)` | `--color-emerald-50` |
| 100 | `oklch(95% 0.052 163.051)` | `--color-emerald-100` |
| 200 | `oklch(90.5% 0.093 164.15)` | `--color-emerald-200` |
| 300 | `oklch(84.5% 0.143 164.978)` | `--color-emerald-300` |
| 400 | `oklch(76.5% 0.177 163.223)` | `--color-emerald-400` |
| 500 | `oklch(69.6% 0.17 162.48)` | `--color-emerald-500` |
| 600 | `oklch(59.6% 0.145 163.225)` | `--color-emerald-600` |
| 700 | `oklch(50.8% 0.118 165.612)` | `--color-emerald-700` |
| 800 | `oklch(43.2% 0.095 166.913)` | `--color-emerald-800` |
| 900 | `oklch(37.8% 0.077 168.94)` | `--color-emerald-900` |
| 950 | `oklch(26.2% 0.051 172.552)` | `--color-emerald-950` |

### Teal

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.4% 0.014 180.72)` | `--color-teal-50` |
| 100 | `oklch(95.3% 0.051 180.801)` | `--color-teal-100` |
| 200 | `oklch(91% 0.096 180.426)` | `--color-teal-200` |
| 300 | `oklch(85.5% 0.138 181.071)` | `--color-teal-300` |
| 400 | `oklch(77.7% 0.152 181.912)` | `--color-teal-400` |
| 500 | `oklch(70.4% 0.14 182.503)` | `--color-teal-500` |
| 600 | `oklch(60% 0.118 184.704)` | `--color-teal-600` |
| 700 | `oklch(51.1% 0.096 186.391)` | `--color-teal-700` |
| 800 | `oklch(43.7% 0.078 188.216)` | `--color-teal-800` |
| 900 | `oklch(38.6% 0.063 188.416)` | `--color-teal-900` |
| 950 | `oklch(27.7% 0.046 192.524)` | `--color-teal-950` |

### Cyan

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.4% 0.019 200.873)` | `--color-cyan-50` |
| 100 | `oklch(95.6% 0.045 203.388)` | `--color-cyan-100` |
| 200 | `oklch(91.7% 0.08 205.041)` | `--color-cyan-200` |
| 300 | `oklch(86.5% 0.127 207.078)` | `--color-cyan-300` |
| 400 | `oklch(78.9% 0.154 211.53)` | `--color-cyan-400` |
| 500 | `oklch(71.5% 0.143 215.221)` | `--color-cyan-500` |
| 600 | `oklch(60.9% 0.126 221.723)` | `--color-cyan-600` |
| 700 | `oklch(52% 0.105 223.128)` | `--color-cyan-700` |
| 800 | `oklch(45% 0.085 224.283)` | `--color-cyan-800` |
| 900 | `oklch(39.8% 0.07 227.392)` | `--color-cyan-900` |
| 950 | `oklch(30.2% 0.056 229.695)` | `--color-cyan-950` |

### Sky

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97.7% 0.013 236.62)` | `--color-sky-50` |
| 100 | `oklch(95.1% 0.026 236.824)` | `--color-sky-100` |
| 200 | `oklch(90.1% 0.058 230.902)` | `--color-sky-200` |
| 300 | `oklch(82.8% 0.111 230.318)` | `--color-sky-300` |
| 400 | `oklch(74.6% 0.16 232.661)` | `--color-sky-400` |
| 500 | `oklch(68.5% 0.169 237.323)` | `--color-sky-500` |
| 600 | `oklch(58.8% 0.158 241.966)` | `--color-sky-600` |
| 700 | `oklch(50% 0.134 242.749)` | `--color-sky-700` |
| 800 | `oklch(44.3% 0.11 240.79)` | `--color-sky-800` |
| 900 | `oklch(39.1% 0.09 240.876)` | `--color-sky-900` |
| 950 | `oklch(29.3% 0.066 243.157)` | `--color-sky-950` |

### Blue

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97% 0.014 254.604)` | `--color-blue-50` |
| 100 | `oklch(93.2% 0.032 255.585)` | `--color-blue-100` |
| 200 | `oklch(88.2% 0.059 254.128)` | `--color-blue-200` |
| 300 | `oklch(80.9% 0.105 251.813)` | `--color-blue-300` |
| 400 | `oklch(70.7% 0.165 254.624)` | `--color-blue-400` |
| 500 | `oklch(62.3% 0.214 259.815)` | `--color-blue-500` |
| 600 | `oklch(54.6% 0.245 262.881)` | `--color-blue-600` |
| 700 | `oklch(48.8% 0.243 264.376)` | `--color-blue-700` |
| 800 | `oklch(42.4% 0.199 265.638)` | `--color-blue-800` |
| 900 | `oklch(37.9% 0.146 265.522)` | `--color-blue-900` |
| 950 | `oklch(28.2% 0.091 267.935)` | `--color-blue-950` |

### Indigo

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(96.2% 0.018 272.314)` | `--color-indigo-50` |
| 100 | `oklch(93% 0.034 272.788)` | `--color-indigo-100` |
| 200 | `oklch(87% 0.065 274.039)` | `--color-indigo-200` |
| 300 | `oklch(78.5% 0.115 274.713)` | `--color-indigo-300` |
| 400 | `oklch(67.3% 0.182 276.935)` | `--color-indigo-400` |
| 500 | `oklch(58.5% 0.233 277.117)` | `--color-indigo-500` |
| 600 | `oklch(51.1% 0.262 276.966)` | `--color-indigo-600` |
| 700 | `oklch(45.7% 0.24 277.023)` | `--color-indigo-700` |
| 800 | `oklch(39.8% 0.195 277.366)` | `--color-indigo-800` |
| 900 | `oklch(35.9% 0.144 278.697)` | `--color-indigo-900` |
| 950 | `oklch(25.7% 0.09 281.288)` | `--color-indigo-950` |

### Violet

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(96.9% 0.016 293.756)` | `--color-violet-50` |
| 100 | `oklch(94.3% 0.029 294.588)` | `--color-violet-100` |
| 200 | `oklch(89.4% 0.057 293.283)` | `--color-violet-200` |
| 300 | `oklch(81.1% 0.111 293.571)` | `--color-violet-300` |
| 400 | `oklch(70.2% 0.183 293.541)` | `--color-violet-400` |
| 500 | `oklch(60.6% 0.25 292.717)` | `--color-violet-500` |
| 600 | `oklch(54.1% 0.281 293.009)` | `--color-violet-600` |
| 700 | `oklch(49.1% 0.27 292.581)` | `--color-violet-700` |
| 800 | `oklch(43.2% 0.232 292.759)` | `--color-violet-800` |
| 900 | `oklch(38% 0.189 293.745)` | `--color-violet-900` |
| 950 | `oklch(28.3% 0.141 291.089)` | `--color-violet-950` |

### Purple

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97.7% 0.014 308.299)` | `--color-purple-50` |
| 100 | `oklch(94.6% 0.033 307.174)` | `--color-purple-100` |
| 200 | `oklch(90.2% 0.063 306.703)` | `--color-purple-200` |
| 300 | `oklch(82.7% 0.119 306.383)` | `--color-purple-300` |
| 400 | `oklch(71.4% 0.203 305.504)` | `--color-purple-400` |
| 500 | `oklch(62.7% 0.265 303.9)` | `--color-purple-500` |
| 600 | `oklch(55.8% 0.288 302.321)` | `--color-purple-600` |
| 700 | `oklch(49.6% 0.265 301.924)` | `--color-purple-700` |
| 800 | `oklch(43.8% 0.218 303.724)` | `--color-purple-800` |
| 900 | `oklch(38.1% 0.176 304.987)` | `--color-purple-900` |
| 950 | `oklch(29.1% 0.149 302.717)` | `--color-purple-950` |

### Fuchsia

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97.7% 0.017 320.058)` | `--color-fuchsia-50` |
| 100 | `oklch(95.2% 0.037 318.852)` | `--color-fuchsia-100` |
| 200 | `oklch(90.3% 0.076 319.62)` | `--color-fuchsia-200` |
| 300 | `oklch(83.3% 0.145 321.434)` | `--color-fuchsia-300` |
| 400 | `oklch(74% 0.238 322.16)` | `--color-fuchsia-400` |
| 500 | `oklch(66.7% 0.295 322.15)` | `--color-fuchsia-500` |
| 600 | `oklch(59.1% 0.293 322.896)` | `--color-fuchsia-600` |
| 700 | `oklch(51.8% 0.253 323.949)` | `--color-fuchsia-700` |
| 800 | `oklch(45.2% 0.211 324.591)` | `--color-fuchsia-800` |
| 900 | `oklch(40.1% 0.17 325.612)` | `--color-fuchsia-900` |
| 950 | `oklch(29.3% 0.136 325.661)` | `--color-fuchsia-950` |

### Pink

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(97.1% 0.014 343.198)` | `--color-pink-50` |
| 100 | `oklch(94.8% 0.028 342.258)` | `--color-pink-100` |
| 200 | `oklch(89.9% 0.061 343.231)` | `--color-pink-200` |
| 300 | `oklch(82.3% 0.12 346.018)` | `--color-pink-300` |
| 400 | `oklch(71.8% 0.202 349.761)` | `--color-pink-400` |
| 500 | `oklch(65.6% 0.241 354.308)` | `--color-pink-500` |
| 600 | `oklch(59.2% 0.249 0.584)` | `--color-pink-600` |
| 700 | `oklch(52.5% 0.223 3.958)` | `--color-pink-700` |
| 800 | `oklch(45.9% 0.187 3.815)` | `--color-pink-800` |
| 900 | `oklch(40.8% 0.153 2.432)` | `--color-pink-900` |
| 950 | `oklch(28.4% 0.109 3.907)` | `--color-pink-950` |

### Rose

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(96.9% 0.015 12.422)` | `--color-rose-50` |
| 100 | `oklch(94.1% 0.03 12.58)` | `--color-rose-100` |
| 200 | `oklch(89.2% 0.058 10.001)` | `--color-rose-200` |
| 300 | `oklch(81% 0.117 11.638)` | `--color-rose-300` |
| 400 | `oklch(71.2% 0.194 13.428)` | `--color-rose-400` |
| 500 | `oklch(64.5% 0.246 16.439)` | `--color-rose-500` |
| 600 | `oklch(58.6% 0.253 17.585)` | `--color-rose-600` |
| 700 | `oklch(51.4% 0.222 16.935)` | `--color-rose-700` |
| 800 | `oklch(45.5% 0.188 13.697)` | `--color-rose-800` |
| 900 | `oklch(41% 0.159 10.272)` | `--color-rose-900` |
| 950 | `oklch(27.1% 0.105 12.094)` | `--color-rose-950` |

### Slate

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.4% 0.003 247.858)` | `--color-slate-50` |
| 100 | `oklch(96.8% 0.007 247.896)` | `--color-slate-100` |
| 200 | `oklch(92.9% 0.013 255.508)` | `--color-slate-200` |
| 300 | `oklch(86.9% 0.022 252.894)` | `--color-slate-300` |
| 400 | `oklch(70.4% 0.04 256.788)` | `--color-slate-400` |
| 500 | `oklch(55.4% 0.046 257.417)` | `--color-slate-500` |
| 600 | `oklch(44.6% 0.043 257.281)` | `--color-slate-600` |
| 700 | `oklch(37.2% 0.044 257.287)` | `--color-slate-700` |
| 800 | `oklch(27.9% 0.041 260.031)` | `--color-slate-800` |
| 900 | `oklch(20.8% 0.042 265.755)` | `--color-slate-900` |
| 950 | `oklch(12.9% 0.042 264.695)` | `--color-slate-950` |

### Gray

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.5% 0.002 247.839)` | `--color-gray-50` |
| 100 | `oklch(96.7% 0.003 264.542)` | `--color-gray-100` |
| 200 | `oklch(92.8% 0.006 264.531)` | `--color-gray-200` |
| 300 | `oklch(87.2% 0.01 258.338)` | `--color-gray-300` |
| 400 | `oklch(70.7% 0.022 261.325)` | `--color-gray-400` |
| 500 | `oklch(55.1% 0.027 264.364)` | `--color-gray-500` |
| 600 | `oklch(44.6% 0.03 256.802)` | `--color-gray-600` |
| 700 | `oklch(37.3% 0.034 259.733)` | `--color-gray-700` |
| 800 | `oklch(27.8% 0.033 256.848)` | `--color-gray-800` |
| 900 | `oklch(21% 0.034 264.665)` | `--color-gray-900` |
| 950 | `oklch(13% 0.028 261.692)` | `--color-gray-950` |

### Zinc

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.5% 0 0)` | `--color-zinc-50` |
| 100 | `oklch(96.7% 0.001 286.375)` | `--color-zinc-100` |
| 200 | `oklch(92% 0.004 286.32)` | `--color-zinc-200` |
| 300 | `oklch(87.1% 0.006 286.286)` | `--color-zinc-300` |
| 400 | `oklch(70.5% 0.015 286.067)` | `--color-zinc-400` |
| 500 | `oklch(55.2% 0.016 285.938)` | `--color-zinc-500` |
| 600 | `oklch(44.2% 0.017 285.786)` | `--color-zinc-600` |
| 700 | `oklch(37% 0.013 285.805)` | `--color-zinc-700` |
| 800 | `oklch(27.4% 0.006 286.033)` | `--color-zinc-800` |
| 900 | `oklch(21% 0.006 285.885)` | `--color-zinc-900` |
| 950 | `oklch(14.1% 0.005 285.823)` | `--color-zinc-950` |

### Neutral

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.5% 0 0)` | `--color-neutral-50` |
| 100 | `oklch(97% 0 0)` | `--color-neutral-100` |
| 200 | `oklch(92.2% 0 0)` | `--color-neutral-200` |
| 300 | `oklch(87% 0 0)` | `--color-neutral-300` |
| 400 | `oklch(70.8% 0 0)` | `--color-neutral-400` |
| 500 | `oklch(55.6% 0 0)` | `--color-neutral-500` |
| 600 | `oklch(43.9% 0 0)` | `--color-neutral-600` |
| 700 | `oklch(37.1% 0 0)` | `--color-neutral-700` |
| 800 | `oklch(26.9% 0 0)` | `--color-neutral-800` |
| 900 | `oklch(20.5% 0 0)` | `--color-neutral-900` |
| 950 | `oklch(14.5% 0 0)` | `--color-neutral-950` |

### Stone

| Step | OKLCH | CSS Variable |
|------|-------|-------------|
| 50 | `oklch(98.5% 0.001 106.423)` | `--color-stone-50` |
| 100 | `oklch(97% 0.001 106.424)` | `--color-stone-100` |
| 200 | `oklch(92.3% 0.003 48.717)` | `--color-stone-200` |
| 300 | `oklch(86.9% 0.005 56.366)` | `--color-stone-300` |
| 400 | `oklch(70.9% 0.01 56.259)` | `--color-stone-400` |
| 500 | `oklch(55.3% 0.013 58.071)` | `--color-stone-500` |
| 600 | `oklch(44.4% 0.011 73.639)` | `--color-stone-600` |
| 700 | `oklch(37.4% 0.01 67.558)` | `--color-stone-700` |
| 800 | `oklch(26.8% 0.007 34.298)` | `--color-stone-800` |
| 900 | `oklch(21.6% 0.006 56.043)` | `--color-stone-900` |
| 950 | `oklch(14.7% 0.004 49.25)` | `--color-stone-950` |

## Curated Palettes

Hand-crafted palettes designed to showcase OKLCH's capabilities beyond Tailwind defaults.

### Ocean

Deep oceanic blues with subtle teal shift in light shades.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(97.5% 0.012 230)` |
| 100 | `oklch(94.8% 0.028 228)` |
| 200 | `oklch(90.0% 0.058 226)` |
| 300 | `oklch(83.0% 0.105 224)` |
| 400 | `oklch(74.0% 0.155 226)` |
| 500 | `oklch(65.0% 0.175 230)` |
| 600 | `oklch(56.0% 0.165 234)` |
| 700 | `oklch(47.0% 0.140 236)` |
| 800 | `oklch(40.0% 0.110 238)` |
| 900 | `oklch(34.0% 0.085 240)` |
| 950 | `oklch(24.0% 0.060 242)` |

### Dune

Warm sandy tones, golden undertones. Inspired by desert landscapes.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(98.2% 0.015 80)` |
| 100 | `oklch(95.5% 0.035 78)` |
| 200 | `oklch(91.0% 0.065 75)` |
| 300 | `oklch(85.0% 0.110 72)` |
| 400 | `oklch(77.0% 0.150 68)` |
| 500 | `oklch(69.0% 0.155 62)` |
| 600 | `oklch(60.0% 0.140 58)` |
| 700 | `oklch(51.0% 0.120 55)` |
| 800 | `oklch(43.0% 0.100 52)` |
| 900 | `oklch(37.0% 0.080 50)` |
| 950 | `oklch(26.0% 0.055 48)` |

### Void

Ultra-deep purples fading to near-black. For dark themes and dramatic UI.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(97.0% 0.015 300)` |
| 100 | `oklch(93.5% 0.035 298)` |
| 200 | `oklch(88.0% 0.070 296)` |
| 300 | `oklch(80.0% 0.130 294)` |
| 400 | `oklch(70.0% 0.200 292)` |
| 500 | `oklch(60.0% 0.250 290)` |
| 600 | `oklch(50.0% 0.240 288)` |
| 700 | `oklch(42.0% 0.210 286)` |
| 800 | `oklch(35.0% 0.175 284)` |
| 900 | `oklch(28.0% 0.140 282)` |
| 950 | `oklch(18.0% 0.090 280)` |

### Coral

Warm coral-to-salmon range. Vibrant yet not aggressive.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(97.5% 0.015 25)` |
| 100 | `oklch(94.5% 0.035 22)` |
| 200 | `oklch(90.0% 0.070 20)` |
| 300 | `oklch(83.0% 0.130 18)` |
| 400 | `oklch(74.0% 0.195 16)` |
| 500 | `oklch(66.0% 0.225 20)` |
| 600 | `oklch(58.0% 0.220 24)` |
| 700 | `oklch(50.0% 0.190 26)` |
| 800 | `oklch(43.0% 0.158 28)` |
| 900 | `oklch(38.0% 0.125 30)` |
| 950 | `oklch(26.0% 0.085 32)` |

### Moss

Natural greens with low chroma. Calm, organic feel.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(98.0% 0.015 145)` |
| 100 | `oklch(95.5% 0.035 143)` |
| 200 | `oklch(91.0% 0.065 142)` |
| 300 | `oklch(85.0% 0.110 140)` |
| 400 | `oklch(77.0% 0.145 138)` |
| 500 | `oklch(68.0% 0.140 136)` |
| 600 | `oklch(58.0% 0.120 134)` |
| 700 | `oklch(49.0% 0.098 132)` |
| 800 | `oklch(42.0% 0.078 130)` |
| 900 | `oklch(36.0% 0.062 128)` |
| 950 | `oklch(25.0% 0.042 126)` |

### Ember

Deep warm reds with orange undertones. Firelight palette.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(97.8% 0.014 40)` |
| 100 | `oklch(95.0% 0.035 38)` |
| 200 | `oklch(90.0% 0.072 36)` |
| 300 | `oklch(83.0% 0.135 34)` |
| 400 | `oklch(74.0% 0.195 30)` |
| 500 | `oklch(65.0% 0.225 26)` |
| 600 | `oklch(57.0% 0.230 22)` |
| 700 | `oklch(49.0% 0.200 20)` |
| 800 | `oklch(42.0% 0.165 18)` |
| 900 | `oklch(37.0% 0.130 16)` |
| 950 | `oklch(25.0% 0.085 14)` |

### Arctic

Cool icy blues with very low chroma. Clean, minimal feel.

| Step | OKLCH |
|------|-------|
| 50 | `oklch(98.5% 0.008 240)` |
| 100 | `oklch(96.5% 0.016 238)` |
| 200 | `oklch(93.0% 0.030 236)` |
| 300 | `oklch(88.0% 0.050 234)` |
| 400 | `oklch(80.0% 0.075 232)` |
| 500 | `oklch(70.0% 0.085 230)` |
| 600 | `oklch(60.0% 0.080 228)` |
| 700 | `oklch(50.0% 0.068 226)` |
| 800 | `oklch(42.0% 0.055 224)` |
| 900 | `oklch(36.0% 0.045 222)` |
| 950 | `oklch(25.0% 0.030 220)` |

## Naming Conventions

### Tailwind Palettes

Use the official Tailwind name as-is: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `neutral`, `stone`.

### Curated Palettes

- **Evocative nouns** — Names should evoke a material, place, or phenomenon (Ocean, Dune, Void, Coral, Moss, Ember, Arctic)
- **Single word** — No multi-word names
- **Lowercase in code** — `ocean`, `dune`, `void`
- **Title case in UI** — "Ocean", "Dune", "Void"
- **No color names** — Avoid "blue", "green" — these are reserved for Tailwind. Use descriptive names instead.

### ID Format

```
tailwind-red      # Source-name
curated-ocean     # Source-name
generated-h259    # Source-hue
random-a7f3e2     # Source-hash
```

## How to Add a New Palette

### Adding a Curated Palette

1. **Define shades** in `data/curated-palettes.ts`:

```typescript
export const moss: StaticPalette = {
  id: 'curated-moss',
  name: 'Moss',
  source: 'curated',
  shades: {
    50:  { l: 0.980, c: 0.015, h: 145 },
    100: { l: 0.955, c: 0.035, h: 143 },
    200: { l: 0.910, c: 0.065, h: 142 },
    300: { l: 0.850, c: 0.110, h: 140 },
    400: { l: 0.770, c: 0.145, h: 138 },
    500: { l: 0.680, c: 0.140, h: 136 },
    600: { l: 0.580, c: 0.120, h: 134 },
    700: { l: 0.490, c: 0.098, h: 132 },
    800: { l: 0.420, c: 0.078, h: 130 },
    900: { l: 0.360, c: 0.062, h: 128 },
    950: { l: 0.250, c: 0.042, h: 126 },
  },
};
```

2. **Add to exports** in the same file:

```typescript
export const curatedPalettes: StaticPalette[] = [
  ocean, dune, void_, coral, moss, ember, arctic,
];
```

3. **Run quality check** (see Quality Criteria below)

4. **Test visually** — Load in the app, check all shades render correctly

### Quality Criteria Checklist

Every palette (curated or generated) must pass these 6 criteria:

| # | Criterion | Test |
|---|-----------|------|
| 1 | **Monotonic lightness** | L values must strictly decrease from 50→950 |
| 2 | **sRGB displayable** | At least 9 of 11 shades must be in sRGB gamut |
| 3 | **Contrast range** | Shade 50 must have APCA Lc ≥ 90 on black; Shade 950 must have Lc ≥ 90 on white |
| 4 | **Chroma bell curve** | Peak chroma at 500-600, reduced at extremes |
| 5 | **Hue consistency** | Hue variation across shades ≤ 15 degrees |
| 6 | **Perceptual smoothness** | No visible banding or jumps between adjacent shades |

### Validation Function

```typescript
function validatePalette(palette: StaticPalette): string[] {
  const errors: string[] = [];
  const steps = SHADE_STEPS;

  // 1. Monotonic lightness
  for (let i = 1; i < steps.length; i++) {
    if (palette.shades[steps[i]].l >= palette.shades[steps[i - 1]].l) {
      errors.push(`Lightness not decreasing: ${steps[i-1]}→${steps[i]}`);
    }
  }

  // 2. sRGB displayable
  const outOfGamut = steps.filter(s =>
    getGamutStatus(palette.shades[s]) === 'out'
  );
  if (outOfGamut.length > 2) {
    errors.push(`Too many out-of-gamut shades: ${outOfGamut.join(', ')}`);
  }

  // 3. Contrast range
  // ... check APCA Lc values for 50 and 950

  // 5. Hue consistency
  const hues = steps.map(s => palette.shades[s].h);
  const hueRange = Math.max(...hues) - Math.min(...hues);
  if (hueRange > 15) {
    errors.push(`Hue range too wide: ${hueRange.toFixed(1)}°`);
  }

  return errors;
}
```

## CSS Variables Output Format

When a user copies "all" or exports a palette, the output format is:

```css
:root {
  --color-blue-50: oklch(97% 0.014 254.604);
  --color-blue-100: oklch(93.2% 0.032 255.585);
  --color-blue-200: oklch(88.2% 0.059 254.128);
  --color-blue-300: oklch(80.9% 0.105 251.813);
  --color-blue-400: oklch(70.7% 0.165 254.624);
  --color-blue-500: oklch(62.3% 0.214 259.815);
  --color-blue-600: oklch(54.6% 0.245 262.881);
  --color-blue-700: oklch(48.8% 0.243 264.376);
  --color-blue-800: oklch(42.4% 0.199 265.638);
  --color-blue-900: oklch(37.9% 0.146 265.522);
  --color-blue-950: oklch(28.2% 0.091 267.935);
}
```

For generated/custom palettes, the variable names use the palette name or a generic prefix:

```css
:root {
  --color-custom-50: oklch(...);
  /* ... */
  --color-custom-950: oklch(...);
}
```
