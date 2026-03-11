import type { Metadata } from "next";
import { BiSolidBookOpen } from "react-icons/bi";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { UniformityDemo } from "@/components/docs/uniformity-demo";
import { ChannelExplorer } from "@/components/docs/channel-explorer";
import { GradientComparison } from "@/components/docs/gradient-comparison";
import { GamutExplorer } from "@/components/docs/gamut-explorer";
import { LivePaletteDemo } from "@/components/docs/live-palette-demo";
import { SectionNav } from "@/components/docs/section-nav";

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "hsl-problem", label: "Problem with HSL" },
  { id: "channels", label: "Three channels" },
  { id: "gradients", label: "Gradients" },
  { id: "gamut", label: "Wide gamut" },
  { id: "palettes", label: "Palettes" },
  { id: "css", label: "CSS" },
];

export const metadata: Metadata = {
  title: "OKLCH Color Space Guide",
  description:
    "Interactive guide to the OKLCH color space. Compare HSL vs OKLCH uniformity, explore L/C/H channels, see wide gamut P3 colors, and build palettes live.",
  alternates: { canonical: "/docs" },
};

const CHANNELS = [
  {
    letter: "L",
    title: "Lightness",
    range: "0 to 1",
    description:
      "How bright a color is. 0 is pure black, 1 is pure white. Unlike HSL, changing lightness here always looks the same to your eyes, no matter the color.",
  },
  {
    letter: "C",
    title: "Chroma",
    range: "0 to 0.37",
    description:
      "How vivid a color is. 0 is completely gray, higher values are more colorful. Very high values may not display on all screens.",
  },
  {
    letter: "H",
    title: "Hue",
    range: "0 to 360",
    description:
      "Which color on the wheel. Think of it like a clock: red at the top, yellow at 90, green at 145, blue at 265, purple at 305.",
  },
];

const CSS_CODE = `/* Set a color */
.button {
  background: oklch(0.7 0.15 264);
}

/* Define your palette as variables */
:root {
  --brand-500: oklch(0.65 0.2 264);
  --brand-100: oklch(0.93 0.04 264);
  --brand-900: oklch(0.25 0.12 264);
}

/* Lighten or desaturate with relative colors */
.button:hover {
  background: oklch(from var(--brand-500) calc(l + 0.1) c h);
}`;

export default function DocsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader
        icon={BiSolidBookOpen}
        title="Documentation"
        subtitle="Everything you need to know about the OKLCH color space."
      />

      <div className="flex gap-6 px-4 py-10 lg:gap-10 lg:px-10">
        <div className="flex min-w-0 flex-1 flex-col gap-16">
        {/* Section 0: Hero */}
        <section id="intro" className="flex flex-col gap-5 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-4xl font-bold tracking-[-0.04em] text-foreground">
            Colors, but finally honest
          </h2>
          <p className="max-w-3xl text-base leading-[1.7] text-muted-foreground">
            OKLCH is a color space where the numbers actually match what your
            eyes see. Pick a lightness of 70% and every color looks equally
            bright. No tricks, no surprises.
          </p>

          {/* Full OKLCH spectrum */}
          <div
            className="h-16 rounded-[var(--layout-radius-xl)]"
            style={{
              background:
                "linear-gradient(to right in oklch, oklch(0.7 0.25 0), oklch(0.7 0.25 60), oklch(0.7 0.25 120), oklch(0.7 0.25 180), oklch(0.7 0.25 240), oklch(0.7 0.25 300), oklch(0.7 0.25 360))",
            }}
            role="img"
            aria-label="Full OKLCH hue spectrum at constant lightness and chroma"
          />

          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral" size="sm" type="light">
              CSS Color Level 4
            </Badge>
            <Badge variant="neutral" size="sm" type="light">
              All Modern Browsers
            </Badge>
            <Badge variant="neutral" size="sm" type="light">
              Wide Gamut
            </Badge>
          </div>
        </section>

        {/* Section 1: The Problem with HSL */}
        <section id="hsl-problem" className="flex flex-col gap-4 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            The problem with HSL
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            HSL lies to your eyes. Set the same lightness on yellow and blue:
            yellow looks almost white while blue looks almost black. Same number,
            completely different result. OKLCH fixes this.
          </p>
          <UniformityDemo />
        </section>

        {/* Section 2: The Three Channels */}
        <section id="channels" className="flex flex-col gap-4 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            The three channels
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CHANNELS.map(({ letter, title, range, description }) => (
              <div
                key={letter}
                className="flex flex-col gap-3 rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-6"
              >
                <span className="font-[var(--font-family-heading)] text-[40px] font-bold tracking-[-0.04em] text-foreground">
                  {letter}
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="font-[var(--font-family-heading)] text-lg font-semibold tracking-[-0.04em] text-foreground">
                    {title}
                  </h3>
                  <Badge variant="neutral" size="sm">
                    {range}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
          <ChannelExplorer />
        </section>

        {/* Section 3: Better Gradients */}
        <section id="gradients" className="flex flex-col gap-4 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Better gradients
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            HSL gradients between opposite colors turn muddy gray in the middle.
            OKLCH keeps colors vibrant through the entire transition.
          </p>
          <GradientComparison />
        </section>

        {/* Section 4: Wide Gamut */}
        <section id="gamut" className="flex flex-col gap-4 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Wide gamut colors
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Modern screens can show 50% more colors than old sRGB. OKLCH lets
            you use all of them. Push the chroma slider up and watch the badge
            change when you leave sRGB territory.
          </p>
          <GamutExplorer />
        </section>

        {/* Section 5: Build Palettes */}
        <section id="palettes" className="flex flex-col gap-4 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Build palettes
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Type any CSS color and get 11 shades instantly. Because OKLCH is
            perceptually uniform, every shade looks exactly as bright as it
            should.
          </p>
          <LivePaletteDemo />
        </section>

        {/* Section 6: Use it in CSS */}
        <section id="css" className="flex flex-col gap-4 scroll-mt-6">
          <h2 className="font-[var(--font-family-heading)] text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Use it in CSS
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            OKLCH works in all modern browsers (Chrome 111+, Safari 15.4+,
            Firefox 113+). That covers about 96% of users.
          </p>
          <pre className="overflow-x-auto rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-5 font-mono text-[13px] leading-relaxed text-foreground">
            {CSS_CODE}
          </pre>
        </section>
        </div>

        {/* Right anchor nav */}
        <div className="hidden w-36 shrink-0 xl:block">
          <SectionNav sections={SECTIONS} />
        </div>
      </div>
    </div>
  );
}
