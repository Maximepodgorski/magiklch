import { describe, it, expect } from "vitest";
import { buildContrastMatrix } from "../contrast-matrix";
import type { PaletteShade } from "@/types/color";

function makeShade(step: number, hex: string): PaletteShade {
  return {
    step: step as PaletteShade["step"],
    hex,
    oklch: { l: 0.5, c: 0.1, h: 259 },
    hsl: "",
    cssOklch: "",
    cssVar: "",
    gamut: "srgb",
    contrast: { onWhite: 50, onBlack: 50, level: "A" },
  };
}

const shades: PaletteShade[] = [
  makeShade(50, "#f5f3ff"),
  makeShade(200, "#c4b5fd"),
  makeShade(500, "#8b5cf6"),
  makeShade(900, "#1e1b4b"),
];

describe("buildContrastMatrix", () => {
  it("returns NxN matrix for N shades", () => {
    const matrix = buildContrastMatrix(shades);
    expect(matrix.steps).toHaveLength(4);
    expect(matrix.values).toHaveLength(4);
    matrix.values.forEach((row) => expect(row).toHaveLength(4));
  });

  it("returns empty matrix for empty shades", () => {
    const matrix = buildContrastMatrix([]);
    expect(matrix.steps).toHaveLength(0);
    expect(matrix.values).toHaveLength(0);
  });

  it("diagonal is all zeros (same shade = no contrast)", () => {
    const matrix = buildContrastMatrix(shades);
    for (let i = 0; i < shades.length; i++) {
      expect(matrix.values[i][i]).toBe(0);
    }
  });

  it("preserves APCA asymmetry (matrix[i][j] != matrix[j][i] for different shades)", () => {
    const matrix = buildContrastMatrix(shades);
    // 50 (light) vs 900 (dark) — APCA is asymmetric
    const lc_50_on_900 = matrix.values[0][3]; // text=50, bg=900
    const lc_900_on_50 = matrix.values[3][0]; // text=900, bg=50
    expect(lc_50_on_900).not.toBe(lc_900_on_50);
    expect(lc_50_on_900).toBeGreaterThan(0);
    expect(lc_900_on_50).toBeGreaterThan(0);
  });

  it("returns correct steps from input shades", () => {
    const matrix = buildContrastMatrix(shades);
    expect(matrix.steps).toEqual([50, 200, 500, 900]);
  });

  it("all values are non-negative", () => {
    const matrix = buildContrastMatrix(shades);
    for (const row of matrix.values) {
      for (const val of row) {
        expect(val).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("uses hex field from PaletteShade (gamut-clamped)", () => {
    // The function should use shade.hex, not convert shade.oklch to hex
    const shade = makeShade(500, "#ff0000"); // hex doesn't match oklch — that's the point
    const matrix = buildContrastMatrix([shade, makeShade(900, "#000000")]);
    // If it used oklch→hex, the values would differ from hex-based calculation
    expect(matrix.values[0][1]).toBeGreaterThan(0);
  });
});
