/** OKLCH color representation */
export interface OklchColor {
  l: number; // Lightness 0-1
  c: number; // Chroma 0-0.4
  h: number; // Hue 0-360
}

/** Shade step values matching Tailwind convention */
export type ShadeStep =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

export const SHADE_STEPS: readonly ShadeStep[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/** Gamut status for a color */
export type GamutStatus = "srgb" | "p3" | "out";

/** APCA contrast badge level */
export type ContrastLevel = "AAA" | "AA" | "A" | "Fail";

/** Single shade in a palette */
export interface PaletteShade {
  step: ShadeStep;
  oklch: OklchColor;
  hex: string;
  hsl: string;
  cssOklch: string; // "oklch(0.623 0.214 259)"
  cssVar: string; // "--color-blue-500"
  gamut: GamutStatus;
  contrast: {
    onWhite: number; // APCA Lc value (absolute)
    onBlack: number; // APCA Lc value (absolute)
    level: ContrastLevel; // Best of onWhite/onBlack
  };
}

/** Color output format options */
export type ColorFormat = "oklch" | "hex" | "hsl" | "cssvar";

/** Complete palette */
export interface Palette {
  id: string; // URL-safe slug
  name: string; // Display name
  source: "tailwind" | "curated" | "generated" | "random";
  baseColor: OklchColor; // The input color (shade-500 equivalent)
  shades?: PaletteShade[]; // Pre-computed static data (optional for catalogue)
}

/** User input — any color format accepted */
export interface ColorInput {
  raw: string; // User input string
  parsed: OklchColor | null; // Parsed result (null if invalid)
  format: "hex" | "oklch" | "hsl" | "rgb" | "named" | "unknown";
}

/** URL state for sharing */
export interface PaletteUrlState {
  h: number; // Hue
  c: number; // Chroma
  l?: number; // Lightness (optional, defaults to 0.65)
  name?: string; // Custom name
}
