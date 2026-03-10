"use client";

import { useState, useMemo } from "react";
import { getGamutStatus, mapToSrgb } from "@/lib/gamut";
import { toHex, toCssOklch } from "@/lib/color-formatter";
import { Badge } from "@/components/ui/badge";
import type { OklchColor } from "@/types/color";

const GAMUT_CONFIG = {
  srgb: { label: "sRGB", variant: "success" as const },
  p3: { label: "Display P3", variant: "warning" as const },
  out: { label: "Out of gamut", variant: "danger" as const },
};

export function GamutExplorer() {
  const [hue, setHue] = useState(150);
  const [chroma, setChroma] = useState(0.2);

  const color: OklchColor = useMemo(
    () => ({ l: 0.7, c: chroma, h: hue }),
    [hue, chroma]
  );

  const gamut = getGamutStatus(color);
  const srgb = mapToSrgb(color);
  const hex = toHex(srgb);
  const css = toCssOklch(color);
  const config = GAMUT_CONFIG[gamut];

  return (
    <div className="flex flex-col gap-6 rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        {/* Swatch + badge */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="aspect-square w-full rounded-[var(--layout-radius-lg)] md:w-32"
            style={{ backgroundColor: hex }}
          />
          <Badge variant={config.variant} size="sm" type="light">
            {config.label}
          </Badge>
        </div>

        {/* Sliders */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Hue */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-foreground">
                Hue
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {Math.round(hue)}°
              </span>
            </div>
            <div className="relative h-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${Array.from({ length: 13 }, (_, i) => `oklch(0.7 ${chroma} ${i * 30})`).join(", ")})`,
                }}
              />
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="slider-gradient absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                aria-label={`Hue: ${Math.round(hue)}°`}
              />
            </div>
          </div>

          {/* Chroma */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-foreground">
                Chroma
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {chroma.toFixed(3)}
              </span>
            </div>
            <div className="relative h-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(to right, oklch(0.7 0 ${hue}), oklch(0.7 0.37 ${hue}))`,
                }}
              />
              <input
                type="range"
                min={0}
                max={0.37}
                step={0.001}
                value={chroma}
                onChange={(e) => setChroma(parseFloat(e.target.value))}
                className="slider-gradient absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                aria-label={`Chroma: ${chroma.toFixed(3)}`}
              />
            </div>
          </div>

          {/* CSS output */}
          <code className="block rounded-[var(--layout-radius-md)] bg-muted px-3 py-2 font-mono text-xs text-foreground">
            {css}
          </code>
        </div>
      </div>
    </div>
  );
}
