import "./setup-culori";
import { parseColor } from "./color-parser";
import type { ExtractedColor, ExtractedPalette } from "@/types/color";

const ACHROMATIC_THRESHOLD = 0.04;
const HUE_CLUSTER_RANGE = 30;
const MAX_PER_CLUSTER = 12;

const HUE_NAMES: [number, string][] = [
  [10, "Reds"],
  [55, "Oranges"],
  [80, "Yellows"],
  [120, "Limes"],
  [160, "Greens"],
  [200, "Teals"],
  [270, "Blues"],
  [310, "Purples"],
  [345, "Pinks"],
  [360, "Reds"],
];

/**
 * Pick `max` evenly-spaced colors from a lightness-sorted array.
 * Keeps the full light→dark spread without near-duplicates.
 */
function selectSpread(colors: ExtractedColor[], max: number): ExtractedColor[] {
  if (colors.length <= max) return colors;
  if (max <= 1) return [colors[0]];
  const result: ExtractedColor[] = [];
  for (let i = 0; i < max; i++) {
    const idx = Math.round((i * (colors.length - 1)) / (max - 1));
    result.push(colors[idx]);
  }
  return result;
}

function getHueName(hue: number): string {
  for (const [boundary, name] of HUE_NAMES) {
    if (hue < boundary) return name;
  }
  return "Reds";
}

/**
 * Parse a comma-separated hex string from URL params into ExtractedColor[].
 * Skips invalid values, deduplicates.
 */
export function parseColorsParam(param: string): ExtractedColor[] {
  if (!param.trim()) return [];

  const seen = new Set<string>();
  const results: ExtractedColor[] = [];

  for (const raw of param.split(",")) {
    const hex = raw.trim().toLowerCase();
    if (!hex) continue;

    const expanded = hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex;
    const fullHex = `#${expanded}`;
    if (seen.has(fullHex)) continue;

    const oklch = parseColor(fullHex);
    if (!oklch) continue;

    seen.add(fullHex);
    results.push({ hex: fullHex, oklch });
  }

  return results;
}

/**
 * Cluster extracted colors by hue proximity.
 * Achromatic colors (chroma < 0.04) go to "Neutrals".
 * Each cluster sorted by lightness (light → dark).
 * Neutrals placed last.
 */
export function clusterByHue(colors: ExtractedColor[]): ExtractedPalette[] {
  if (colors.length === 0) return [];

  const neutrals: ExtractedColor[] = [];
  const chromatic: ExtractedColor[] = [];

  for (const color of colors) {
    if (color.oklch.c < ACHROMATIC_THRESHOLD) {
      neutrals.push(color);
    } else {
      chromatic.push(color);
    }
  }

  // Group chromatic colors by hue bucket
  const buckets = new Map<string, ExtractedColor[]>();

  for (const color of chromatic) {
    const bucketCenter =
      Math.round(color.oklch.h / HUE_CLUSTER_RANGE) * HUE_CLUSTER_RANGE;
    const key = String(bucketCenter);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(color);
    } else {
      buckets.set(key, [color]);
    }
  }

  // Merge buckets by hue name (e.g. two buckets both labeled "Blues")
  const merged = new Map<string, ExtractedColor[]>();

  const sortedKeys = [...buckets.keys()].sort(
    (a, b) => Number(a) - Number(b)
  );

  for (const key of sortedKeys) {
    const bucketColors = buckets.get(key)!;
    const avgHue =
      bucketColors.reduce((sum, c) => sum + c.oklch.h, 0) /
      bucketColors.length;
    const label = getHueName(avgHue);

    const existing = merged.get(label);
    if (existing) {
      existing.push(...bucketColors);
    } else {
      merged.set(label, [...bucketColors]);
    }
  }

  // Convert to ExtractedPalette[], sorted by lightness within each
  const clusters: ExtractedPalette[] = [];

  for (const [label, colors] of merged) {
    colors.sort((a, b) => b.oklch.l - a.oklch.l);
    clusters.push({
      label,
      colors: selectSpread(colors, MAX_PER_CLUSTER),
    });
  }

  // Add neutrals last
  if (neutrals.length > 0) {
    neutrals.sort((a, b) => b.oklch.l - a.oklch.l);
    clusters.push({ label: "Neutrals", colors: selectSpread(neutrals, MAX_PER_CLUSTER) });
  }

  return clusters;
}
