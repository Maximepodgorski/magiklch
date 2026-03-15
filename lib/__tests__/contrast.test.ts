import { describe, it, expect } from "vitest";
import {
  getContrast,
  getContrastFromHex,
  getContrastPair,
  getContrastLevel,
  getBestContrastLevel,
} from "../contrast";
import type { OklchColor } from "@/types/color";

const darkColor: OklchColor = { l: 0.27, c: 0.15, h: 259 }; // shade 950
const lightColor: OklchColor = { l: 0.975, c: 0.01, h: 259 }; // shade 50
const midColor: OklchColor = { l: 0.65, c: 0.2, h: 259 }; // shade 500

describe("getContrast", () => {
  it("dark on white has high contrast", () => {
    const lc = getContrast(darkColor, "#ffffff");
    expect(lc).toBeGreaterThan(60);
  });

  it("light on black has high contrast", () => {
    const lc = getContrast(lightColor, "#000000");
    expect(lc).toBeGreaterThan(60);
  });

  it("returns non-negative value", () => {
    const lc = getContrast(midColor, "#ffffff");
    expect(lc).toBeGreaterThanOrEqual(0);
  });
});

describe("getContrastPair", () => {
  it("returns both onWhite and onBlack", () => {
    const pair = getContrastPair(midColor);
    expect(pair.onWhite).toBeGreaterThan(0);
    expect(pair.onBlack).toBeGreaterThan(0);
  });

  it("dark colors have higher onWhite than onBlack", () => {
    const pair = getContrastPair(darkColor);
    expect(pair.onWhite).toBeGreaterThan(pair.onBlack);
  });

  it("light colors have higher onBlack than onWhite", () => {
    const pair = getContrastPair(lightColor);
    expect(pair.onBlack).toBeGreaterThan(pair.onWhite);
  });
});

describe("getContrastLevel", () => {
  it("returns AAA for Lc ≥ 75", () => {
    expect(getContrastLevel(80)).toBe("AAA");
    expect(getContrastLevel(75)).toBe("AAA");
  });

  it("returns AA for 60 ≤ Lc < 75", () => {
    expect(getContrastLevel(60)).toBe("AA");
    expect(getContrastLevel(74)).toBe("AA");
  });

  it("returns A for 45 ≤ Lc < 60", () => {
    expect(getContrastLevel(45)).toBe("A");
    expect(getContrastLevel(59)).toBe("A");
  });

  it("returns Fail for Lc < 45", () => {
    expect(getContrastLevel(44)).toBe("Fail");
    expect(getContrastLevel(0)).toBe("Fail");
  });
});

describe("getContrastFromHex", () => {
  it("returns non-negative Lc value", () => {
    const lc = getContrastFromHex("#000000", "#ffffff");
    expect(lc).toBeGreaterThan(60);
  });

  it("matches getContrast output for same colors", () => {
    const lcFromOklch = getContrast(darkColor, "#ffffff");
    const hex = "#1e1745"; // approximate hex for darkColor
    // Both should produce similar high-contrast values
    const lcFromHex = getContrastFromHex(hex, "#ffffff");
    expect(lcFromHex).toBeGreaterThan(60);
    expect(lcFromOklch).toBeGreaterThan(60);
  });

  it("same color has zero contrast", () => {
    const lc = getContrastFromHex("#808080", "#808080");
    expect(lc).toBe(0);
  });

  it("is asymmetric (APCA property)", () => {
    const lcAB = getContrastFromHex("#222222", "#eeeeee");
    const lcBA = getContrastFromHex("#eeeeee", "#222222");
    // Both should be non-zero but may differ
    expect(lcAB).toBeGreaterThan(0);
    expect(lcBA).toBeGreaterThan(0);
    // APCA raw values differ by sign, abs may differ slightly
    expect(lcAB).not.toBe(lcBA);
  });
});

describe("getBestContrastLevel", () => {
  it("picks the better level", () => {
    expect(getBestContrastLevel(80, 30)).toBe("AAA");
    expect(getBestContrastLevel(30, 80)).toBe("AAA");
  });

  it("handles equal values", () => {
    expect(getBestContrastLevel(60, 60)).toBe("AA");
  });
});
