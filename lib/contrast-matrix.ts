import { getContrastFromHex } from "./contrast";
import type { PaletteShade, ShadeStep } from "@/types/color";

export interface ContrastMatrix {
  steps: ShadeStep[];
  /** values[row][col] = APCA Lc for text=steps[row] on bg=steps[col] */
  values: number[][];
}

/**
 * Build an NxN APCA contrast matrix from palette shades.
 * Row = text color, Column = background color.
 * Uses gamut-clamped .hex field from each shade.
 */
export function buildContrastMatrix(shades: PaletteShade[]): ContrastMatrix {
  const steps = shades.map((s) => s.step);
  const hexes = shades.map((s) => s.hex);
  const n = shades.length;

  const values: number[][] = [];
  for (let row = 0; row < n; row++) {
    const rowValues: number[] = [];
    for (let col = 0; col < n; col++) {
      if (row === col) {
        rowValues.push(0);
      } else {
        rowValues.push(getContrastFromHex(hexes[row], hexes[col]));
      }
    }
    values.push(rowValues);
  }

  return { steps, values };
}
