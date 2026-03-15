import { calcAPCA } from "apca-w3";
import type { OklchColor, ContrastLevel } from "@/types/color";
import { toHex } from "./color-formatter";

/**
 * Calculate APCA contrast between an OKLCH color and a background.
 * Returns absolute Lc value (0-108).
 *
 * Raw APCA Lc is signed:
 * - Positive: dark text on light background
 * - Negative: light text on dark background
 * We always store the absolute value.
 */
export function getContrast(
  foreground: OklchColor,
  background: string
): number {
  const fgHex = toHex(foreground);
  const rawLc = calcAPCA(fgHex, background);
  return Math.abs(Number(rawLc));
}

/**
 * Calculate APCA contrast between two hex colors.
 * Returns absolute Lc value (0-108).
 */
export function getContrastFromHex(fgHex: string, bgHex: string): number {
  const rawLc = calcAPCA(fgHex, bgHex);
  return Math.abs(Number(rawLc));
}

/**
 * Calculate contrast of a color against both white and black.
 */
export function getContrastPair(color: OklchColor): {
  onWhite: number;
  onBlack: number;
} {
  return {
    onWhite: getContrast(color, "#ffffff"),
    onBlack: getContrast(color, "#000000"),
  };
}

/**
 * Classify APCA Lc value into a contrast level.
 * Based on APCA readability criteria:
 * - AAA: Lc ≥ 75 (enhanced, body text)
 * - AA: Lc ≥ 60 (minimum body text)
 * - A: Lc ≥ 45 (large text / non-text)
 * - Fail: Lc < 45
 */
export function getContrastLevel(lc: number): ContrastLevel {
  const abs = Math.abs(lc);
  if (abs >= 75) return "AAA";
  if (abs >= 60) return "AA";
  if (abs >= 45) return "A";
  return "Fail";
}

/**
 * Get the best contrast level from onWhite and onBlack.
 */
export function getBestContrastLevel(
  onWhite: number,
  onBlack: number
): ContrastLevel {
  const best = Math.max(onWhite, onBlack);
  return getContrastLevel(best);
}
