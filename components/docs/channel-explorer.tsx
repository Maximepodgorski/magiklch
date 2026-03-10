"use client";

import { useState, useCallback } from "react";
import type { OklchColor } from "@/types/color";
import { toHex, toCssOklch } from "@/lib/color-formatter";
import { mapToSrgb } from "@/lib/gamut";

const SLIDERS = [
  { key: "l" as const, label: "L", min: 0, max: 1, step: 0.01 },
  { key: "c" as const, label: "C", min: 0, max: 0.4, step: 0.001 },
  { key: "h" as const, label: "H", min: 0, max: 360, step: 1 },
] as const;

function getTrackGradient(key: "l" | "c" | "h", color: OklchColor): string {
  const h = Math.round(color.h);
  if (key === "h") {
    const stops = Array.from({ length: 13 }, (_, i) => {
      const hue = i * 30;
      return `oklch(${color.l} ${color.c} ${hue})`;
    });
    return `linear-gradient(to right, ${stops.join(", ")})`;
  }
  if (key === "l") {
    return `linear-gradient(to right, oklch(0 ${color.c} ${h}), oklch(0.5 ${color.c} ${h}), oklch(1 0 ${h}))`;
  }
  return `linear-gradient(to right, oklch(${color.l} 0 ${h}), oklch(${color.l} 0.3 ${h}))`;
}

export function ChannelExplorer() {
  const [color, setColor] = useState<OklchColor>({ l: 0.65, c: 0.2, h: 264 });

  const handleChange = useCallback(
    (key: "l" | "c" | "h", value: number) => {
      setColor((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const srgb = mapToSrgb(color);
  const hex = toHex(srgb);
  const css = toCssOklch(color);

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--layout-radius-xl)] border border-border">
      {/* Color bar */}
      <div
        className="flex h-14 items-center justify-between px-5 transition-colors"
        style={{ backgroundColor: hex }}
      >
        <span
          className="font-mono text-sm font-medium"
          style={{ color: color.l > 0.6 ? "black" : "white" }}
        >
          {hex}
        </span>
        <span
          className="font-mono text-xs"
          style={{
            color: color.l > 0.6 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
          }}
        >
          {css}
        </span>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-4 bg-[var(--background-neutral-faint-default)] p-5">
        {SLIDERS.map(({ key, label, min, max, step }) => {
          const value = color[key];
          const display =
            key === "l"
              ? `${Math.round(value * 100)}%`
              : key === "c"
                ? value.toFixed(3)
                : `${Math.round(value)}°`;

          return (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-foreground">
                  {label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {display}
                </span>
              </div>
              <div className="relative h-3">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: getTrackGradient(key, color) }}
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) =>
                    handleChange(key, parseFloat(e.target.value))
                  }
                  className="slider-gradient absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                  aria-label={`${label}: ${display}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
