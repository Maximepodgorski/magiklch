import { TAILWIND_PALETTES, TAILWIND_ENTRIES } from "./tailwind-palettes";
import { CURATED_PALETTES, CURATED_ENTRIES } from "./curated-palettes";
import type { Palette } from "@/types/color";

export const ALL_PALETTES: Palette[] = [...TAILWIND_PALETTES, ...CURATED_PALETTES];

/** Neutral palettes for Blocks preview (Zinc, Neutral, + Magiklch's own Stone rebrand) */
const NEUTRAL_IDS = new Set(["zinc", "neutral", "stone"]);

const MAGIKLCH_STONE: Palette = {
  ...TAILWIND_PALETTES.find((p) => p.id === "stone")!,
  id: "stone",
  name: "Quarry",
};

export const NEUTRAL_PALETTES: Palette[] = [
  MAGIKLCH_STONE,
  ...TAILWIND_PALETTES.filter((p) => p.id === "zinc" || p.id === "neutral"),
];

/** All chromatic palettes — Tailwind (17) + curated (7) — for brand token overrides */
export const BRAND_PALETTES: Palette[] = [
  ...TAILWIND_PALETTES.filter((p) => !NEUTRAL_IDS.has(p.id)),
  ...CURATED_PALETTES,
];

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
