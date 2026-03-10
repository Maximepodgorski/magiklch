import type { Metadata } from "next";
import { BiSolidBookOpen } from "react-icons/bi";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation — MagicOK",
  description:
    "Everything you need to know about the OKLCH color space. Learn about lightness, chroma, hue, and why OKLCH is better than HSL.",
};

const SPECTRUM_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const CHANNELS = [
  {
    letter: "L",
    title: "Lightness",
    description:
      '0 (black) to 1 (white). Perceptually linear — a change of 0.1 always looks the same to the human eye.',
  },
  {
    letter: "C",
    title: "Chroma",
    description:
      '0 (gray) to ~0.37 (most vivid). Controls saturation intensity. Higher values push toward display gamut limits.',
  },
  {
    letter: "H",
    title: "Hue",
    description:
      '0° to 360° on the color wheel. Red ≈ 25°, Yellow ≈ 90°, Green ≈ 145°, Blue ≈ 265°, Purple ≈ 305°.',
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Perceptual uniformity",
    hsl: "No — same L value looks different across hues",
    oklch: "Yes — L 0.7 looks equally bright at any hue",
  },
  {
    feature: "Gamut",
    hsl: "sRGB only",
    oklch: "Display P3, Rec. 2020 and beyond",
  },
  {
    feature: "Predictability",
    hsl: "Hue shifts when adjusting lightness",
    oklch: "Channels are independent — no hue shifts",
  },
  {
    feature: "Palette generation",
    hsl: "Trial and error — no consistent results",
    oklch: "Systematic — interpolate L and C curves",
  },
  {
    feature: "Browser support",
    hsl: "Universal",
    oklch: "All modern browsers (CSS Color Level 4)",
  },
];

export default function DocsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader
        icon={BiSolidBookOpen}
        title="Documentation"
        subtitle="Everything you need to know about the OKLCH color space."
      />

      <div className="flex flex-col gap-12 px-10 py-10">
        {/* Section 1: Hero */}
        <section className="flex flex-col gap-4">
          <h2 className="font-[var(--font-family-heading)] text-4xl font-bold tracking-[-0.04em] text-foreground">
            What is OKLCH?
          </h2>
          <p className="max-w-3xl text-base leading-[1.7] text-muted-foreground">
            OKLCH is a perceptually uniform color space designed for the modern
            web. It gives designers and developers precise control over
            lightness, chroma, and hue — producing consistent, accessible
            palettes across every screen.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral" size="sm" type="light">
              CSS Color Level 4
            </Badge>
            <Badge variant="neutral" size="sm" type="light">
              Perceptually Uniform
            </Badge>
            <Badge variant="neutral" size="sm" type="light">
              Wide Gamut
            </Badge>
          </div>
        </section>

        {/* Section 2: Color Spectrum */}
        <section>
          <div
            className="flex h-16 overflow-hidden rounded-[var(--layout-radius-xl)]"
            role="img"
            aria-label="Color spectrum showing 8 hues"
          >
            {SPECTRUM_COLORS.map((color, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </section>

        {/* Section 3: The Three Channels */}
        <section className="flex flex-col gap-4">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            The three channels
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CHANNELS.map(({ letter, title, description }) => (
              <div
                key={letter}
                className="flex flex-col gap-3 rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-6"
              >
                <span className="font-[var(--font-family-heading)] text-[40px] font-bold tracking-[-0.04em] text-foreground">
                  {letter}
                </span>
                <h3 className="font-[var(--font-family-heading)] text-lg font-semibold tracking-[-0.04em] text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Why OKLCH over HSL? */}
        <section className="flex flex-col gap-4">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Why OKLCH over HSL?
          </h2>
          <div className="overflow-hidden rounded-[var(--layout-radius-xl)] border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-card">
                  <th className="w-[200px] border-b border-border px-4 py-3 text-left text-[13px] font-medium text-muted-foreground">
                    Feature
                  </th>
                  <th className="border-b border-l border-border px-4 py-3 text-left text-[13px] font-medium text-muted-foreground">
                    HSL
                  </th>
                  <th className="border-b border-l border-border px-4 py-3 text-left text-[13px] font-medium text-muted-foreground">
                    OKLCH
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(({ feature, hsl, oklch }, i) => (
                  <tr key={feature}>
                    <td
                      className={`border-border px-4 py-3 text-sm font-medium text-foreground ${i < COMPARISON_ROWS.length - 1 ? "border-b" : ""}`}
                    >
                      {feature}
                    </td>
                    <td
                      className={`border-l border-border px-4 py-3 text-sm text-muted-foreground ${i < COMPARISON_ROWS.length - 1 ? "border-b" : ""}`}
                    >
                      {hsl}
                    </td>
                    <td
                      className={`border-l border-border px-4 py-3 text-sm text-foreground ${i < COMPARISON_ROWS.length - 1 ? "border-b" : ""}`}
                    >
                      {oklch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: See the Difference */}
        <section className="flex flex-col gap-4">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            See the difference
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Both examples below use the same lightness value within their color
            space. HSL produces drastically different perceived brightness, while
            OKLCH stays visually consistent.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* HSL card */}
            <div className="flex flex-col gap-3 rounded-[var(--layout-radius-xl)] border border-border bg-background p-5">
              <Badge variant="neutral" size="sm" type="light" className="w-fit">
                HSL
              </Badge>
              <p className="text-sm text-muted-foreground">
                Same L value (50%), drastically different perceived brightness.
              </p>
              <div className="flex h-8 overflow-hidden rounded-[var(--layout-radius-lg)]">
                <div className="flex-1" style={{ backgroundColor: "#FFFF00" }} />
                <div className="flex-1" style={{ backgroundColor: "#0000FF" }} />
              </div>
            </div>

            {/* OKLCH card */}
            <div className="flex flex-col gap-3 rounded-[var(--layout-radius-xl)] border border-border bg-background p-5">
              <Badge variant="neutral" size="sm" type="light" className="w-fit">
                OKLCH
              </Badge>
              <p className="text-sm text-muted-foreground">
                Same L value (0.7), visually consistent brightness across hues.
              </p>
              <div className="flex h-8 overflow-hidden rounded-[var(--layout-radius-lg)]">
                <div className="flex-1" style={{ backgroundColor: "#C4A702" }} />
                <div className="flex-1" style={{ backgroundColor: "#6B7CDB" }} />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
