import { TAILWIND_PALETTES, TAILWIND_ENTRIES } from "./tailwind-palettes";
import { CURATED_PALETTES, CURATED_ENTRIES } from "./curated-palettes";
import type { Palette } from "@/types/color";

export const ALL_PALETTES: Palette[] = [...TAILWIND_PALETTES, ...CURATED_PALETTES];

/** Neutral palettes for Blocks preview (Quarry + Zinc + Neutral) */
export const NEUTRAL_PALETTES: Palette[] = [
  CURATED_PALETTES.find((p) => p.id === "quarry")!,
  ...TAILWIND_PALETTES.filter((p) => p.id === "zinc" || p.id === "neutral"),
];

/** Curated brand palettes for Blocks preview — full hue coverage, no close neighbors */
const BRAND_IDS = ["blue", "indigo", "violet", "purple", "pink", "rose", "red"];

export const BRAND_PALETTES: Palette[] = BRAND_IDS
  .map((id) => TAILWIND_PALETTES.find((p) => p.id === id))
  .filter((p): p is Palette => p !== undefined);

/**
 * Get stripe hex colors for any palette by id.
 */
export function getStripeHex(id: string): string[] {
  const tw = TAILWIND_ENTRIES.find((e) => e.name.toLowerCase() === id);
  if (tw) return tw.stripeHex;

  const curated = CURATED_ENTRIES.find((e) => e.name.toLowerCase() === id);
  if (curated) return curated.stripeHex;

  return [];
}

/**
 * Get a palette by id (lowercase name).
 */
export function getPaletteById(id: string): Palette | undefined {
  return ALL_PALETTES.find((p) => p.id === id);
}
