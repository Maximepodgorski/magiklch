"use client";

import { useState } from "react";

const HUES = [0, 45, 90, 135, 180, 225, 270, 315];
const HUE_LABELS = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Teal",
  "Cyan",
  "Blue",
  "Purple",
];

export function UniformityDemo() {
  const [lightness, setLightness] = useState(70);

  return (
    <div className="flex flex-col gap-6 rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-6">
      {/* Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-foreground">
            Lightness
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {lightness}%
          </span>
        </div>
        <div className="relative h-3">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to right, oklch(0 0 0), oklch(0.5 0 0), oklch(1 0 0))`,
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={lightness}
            onChange={(e) => setLightness(parseInt(e.target.value))}
            className="slider-gradient absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
            aria-label={`Lightness: ${lightness}%`}
          />
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* HSL side */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-muted-foreground">
            HSL at {lightness}% lightness
          </span>
          <div className="flex gap-1.5">
            {HUES.map((hue, i) => (
              <div key={hue} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="aspect-square w-full rounded-[var(--layout-radius-md)]"
                  style={{
                    backgroundColor: `hsl(${hue}, 100%, ${lightness}%)`,
                  }}
                  title={`hsl(${hue}, 100%, ${lightness}%)`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {HUE_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* OKLCH side */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-muted-foreground">
            OKLCH at {lightness}% lightness
          </span>
          <div className="flex gap-1.5">
            {HUES.map((hue, i) => (
              <div key={hue} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="aspect-square w-full rounded-[var(--layout-radius-md)]"
                  style={{
                    backgroundColor: `oklch(${lightness}% 0.2 ${hue})`,
                  }}
                  title={`oklch(${lightness}% 0.2 ${hue})`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {HUE_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
