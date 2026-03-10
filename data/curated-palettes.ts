import type { Palette, OklchColor } from "@/types/color";

interface CuratedPaletteEntry {
  name: string;
  baseColor: OklchColor;
  stripeHex: string[];
}

/**
 * 8 curated OKLCH palettes with unique character.
 * Each explores a different region of the OKLCH space.
 */
export const CURATED_ENTRIES: CuratedPaletteEntry[] = [
  {
    name: "Graphite",
    baseColor: { l: 0.65, c: 0.017, h: 86.364 },
    stripeHex: ["#f7f7f5", "#ecebe9", "#dedcd7", "#cac7bf", "#ada9a0", "#948f84", "#797469", "#615d54", "#48453d", "#383530", "#282623"],
  },
  {
    name: "Ocean",
    baseColor: { l: 0.62, c: 0.15, h: 230 },
    stripeHex: ["#f0f4fa", "#dde6f5", "#bccfee", "#94b3e2", "#6892d3", "#4272bf", "#2f5aa3", "#254685", "#1e376a", "#192c54", "#0e1a33"],
  },
  {
    name: "Dune",
    baseColor: { l: 0.65, c: 0.08, h: 55 },
    stripeHex: ["#faf8f2", "#f2efe3", "#e5e0ce", "#d3cab0", "#b8a98a", "#9d8c6a", "#7f7050", "#65583e", "#4d4330", "#3d3526", "#242016"],
  },
  {
    name: "Void",
    baseColor: { l: 0.50, c: 0.28, h: 300 },
    stripeHex: ["#f9f2fd", "#f0e0fb", "#e2c4f7", "#cfa0f0", "#b574e5", "#9747d4", "#7a32b8", "#622698", "#4d1e7a", "#3e1862", "#24103a"],
  },
  {
    name: "Coral",
    baseColor: { l: 0.68, c: 0.19, h: 18 },
    stripeHex: ["#fef3f0", "#fde3dc", "#fcc9be", "#f9a896", "#f4806a", "#e85d45", "#c94530", "#a63725", "#852d1f", "#6b2419", "#3e140e"],
  },
  {
    name: "Moss",
    baseColor: { l: 0.60, c: 0.13, h: 155 },
    stripeHex: ["#f0faf5", "#dcf2e8", "#b8e4d0", "#8cd1b3", "#5eb892", "#3d9c74", "#2d7e5b", "#236347", "#1c4e38", "#163e2d", "#0d251b"],
  },
  {
    name: "Ember",
    baseColor: { l: 0.70, c: 0.20, h: 40 },
    stripeHex: ["#fdf6ef", "#fbeadb", "#f6d4b5", "#efb885", "#e49652", "#d47a2e", "#b06220", "#8c4e1a", "#6e3d15", "#583112", "#34200b"],
  },
  {
    name: "Arctic",
    baseColor: { l: 0.75, c: 0.10, h: 210 },
    stripeHex: ["#f2f8fc", "#e2eff8", "#c8e0f2", "#a6cde9", "#7fb5dd", "#5e9dcb", "#4681b2", "#376792", "#2c5275", "#23415e", "#152838"],
  },
];

export const CURATED_PALETTES: Palette[] = CURATED_ENTRIES.map((entry) => ({
  id: entry.name.toLowerCase(),
  name: entry.name,
  source: "curated" as const,
  baseColor: entry.baseColor,
}));

export function getCuratedStripeHex(id: string): string[] | undefined {
  return CURATED_ENTRIES.find(
    (e) => e.name.toLowerCase() === id
  )?.stripeHex;
}
