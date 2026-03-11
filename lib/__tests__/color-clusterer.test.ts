import { describe, it, expect } from "vitest";
import { clusterByHue, parseColorsParam } from "../color-clusterer";
import type { ExtractedColor } from "@/types/color";

describe("parseColorsParam", () => {
  it("parses comma-separated hex values", () => {
    const result = parseColorsParam("ff0000,00ff00,0000ff");
    expect(result).toHaveLength(3);
    expect(result[0].hex).toBe("#ff0000");
    expect(result[1].hex).toBe("#00ff00");
    expect(result[2].hex).toBe("#0000ff");
  });

  it("returns empty array for empty string", () => {
    expect(parseColorsParam("")).toEqual([]);
  });

  it("skips invalid hex values", () => {
    const result = parseColorsParam("ff0000,zzzzzz,00ff00");
    expect(result).toHaveLength(2);
  });

  it("deduplicates identical hex values", () => {
    const result = parseColorsParam("ff0000,ff0000,ff0000");
    expect(result).toHaveLength(1);
  });

  it("handles 3-char hex shorthand", () => {
    const result = parseColorsParam("f00,0f0");
    expect(result).toHaveLength(2);
  });
});

describe("clusterByHue", () => {
  it("groups colors by hue proximity", () => {
    const colors: ExtractedColor[] = [
      { hex: "#ff0000", oklch: { l: 0.63, c: 0.26, h: 29 } }, // red
      { hex: "#ff3333", oklch: { l: 0.65, c: 0.22, h: 25 } }, // red
      { hex: "#0066ff", oklch: { l: 0.55, c: 0.2, h: 260 } }, // blue
      { hex: "#0044cc", oklch: { l: 0.45, c: 0.18, h: 265 } }, // blue
    ];
    const clusters = clusterByHue(colors);
    expect(clusters).toHaveLength(2);
  });

  it("separates achromatic colors as Neutrals", () => {
    const colors: ExtractedColor[] = [
      { hex: "#808080", oklch: { l: 0.6, c: 0.005, h: 0 } },
      { hex: "#ffffff", oklch: { l: 1, c: 0, h: 0 } },
      { hex: "#000000", oklch: { l: 0, c: 0, h: 0 } },
      { hex: "#ff0000", oklch: { l: 0.63, c: 0.26, h: 29 } },
    ];
    const clusters = clusterByHue(colors);
    const neutrals = clusters.find((c) => c.label === "Neutrals");
    expect(neutrals).toBeDefined();
    expect(neutrals!.colors).toHaveLength(3);
  });

  it("sorts colors within each cluster by lightness", () => {
    const colors: ExtractedColor[] = [
      { hex: "#003399", oklch: { l: 0.35, c: 0.18, h: 260 } },
      { hex: "#6699ff", oklch: { l: 0.7, c: 0.15, h: 255 } },
      { hex: "#0055cc", oklch: { l: 0.5, c: 0.2, h: 262 } },
    ];
    const clusters = clusterByHue(colors);
    expect(clusters).toHaveLength(1);
    const lValues = clusters[0].colors.map((c) => c.oklch.l);
    expect(lValues).toEqual([...lValues].sort((a, b) => b - a));
  });

  it("returns empty array for empty input", () => {
    expect(clusterByHue([])).toEqual([]);
  });

  it("handles single color", () => {
    const colors: ExtractedColor[] = [
      { hex: "#ff0000", oklch: { l: 0.63, c: 0.26, h: 29 } },
    ];
    const clusters = clusterByHue(colors);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].colors).toHaveLength(1);
  });

  it("places Neutrals cluster last", () => {
    const colors: ExtractedColor[] = [
      { hex: "#808080", oklch: { l: 0.6, c: 0.005, h: 0 } },
      { hex: "#ff0000", oklch: { l: 0.63, c: 0.26, h: 29 } },
      { hex: "#0066ff", oklch: { l: 0.55, c: 0.2, h: 260 } },
    ];
    const clusters = clusterByHue(colors);
    expect(clusters[clusters.length - 1].label).toBe("Neutrals");
  });

  it("treats low-chroma colors as neutrals (threshold 0.04)", () => {
    const colors: ExtractedColor[] = [
      { hex: "#d4b5a0", oklch: { l: 0.78, c: 0.035, h: 55 } }, // desaturated beige → neutral
      { hex: "#b0a8c0", oklch: { l: 0.72, c: 0.03, h: 290 } }, // desaturated lavender → neutral
      { hex: "#ff0000", oklch: { l: 0.63, c: 0.26, h: 29 } },  // chromatic red
    ];
    const clusters = clusterByHue(colors);
    const neutrals = clusters.find((c) => c.label === "Neutrals");
    expect(neutrals).toBeDefined();
    expect(neutrals!.colors).toHaveLength(2);
  });

  it("caps clusters at 12 colors, evenly spaced by lightness", () => {
    // Generate 20 blues with varying lightness
    const colors: ExtractedColor[] = Array.from({ length: 20 }, (_, i) => ({
      hex: `#0000${(i * 10 + 50).toString(16).padStart(2, "0")}`,
      oklch: { l: (i + 1) / 21, c: 0.2, h: 250 },
    }));
    const clusters = clusterByHue(colors);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].colors).toHaveLength(12);
    // First should be lightest, last should be darkest
    expect(clusters[0].colors[0].oklch.l).toBeGreaterThan(
      clusters[0].colors[11].oklch.l
    );
  });

  it("caps neutrals at 12 colors", () => {
    const colors: ExtractedColor[] = Array.from({ length: 25 }, (_, i) => ({
      hex: `#${(i * 10 + 5).toString(16).padStart(2, "0").repeat(3)}`,
      oklch: { l: (i + 1) / 26, c: 0.005, h: 0 },
    }));
    const clusters = clusterByHue(colors);
    const neutrals = clusters.find((c) => c.label === "Neutrals");
    expect(neutrals).toBeDefined();
    expect(neutrals!.colors).toHaveLength(12);
  });

  it("labels clusters by hue name", () => {
    const colors: ExtractedColor[] = [
      { hex: "#ff0000", oklch: { l: 0.63, c: 0.26, h: 5 } },   // Reds (h < 10)
      { hex: "#0066ff", oklch: { l: 0.55, c: 0.2, h: 250 } },  // Blues (200-270)
      { hex: "#00cc66", oklch: { l: 0.7, c: 0.18, h: 140 } },   // Greens (120-160)
    ];
    const clusters = clusterByHue(colors);
    const labels = clusters.map((c) => c.label);
    expect(labels).toContain("Reds");
    expect(labels).toContain("Blues");
    expect(labels).toContain("Greens");
  });
});
