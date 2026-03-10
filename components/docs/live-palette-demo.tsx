"use client";

import { useState, useMemo } from "react";
import { generatePaletteFromString } from "@/lib/color-engine";
import { Input } from "@/components/ui/input";

const PRESETS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Emerald", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
];

export function LivePaletteDemo() {
  const [input, setInput] = useState("#6366f1");

  const palette = useMemo(() => {
    const p = generatePaletteFromString(input, "preview");
    if (!p?.shades) return null;
    return p as typeof p & { shades: NonNullable<typeof p.shades> };
  }, [input]);

  return (
    <div className="flex flex-col gap-5 rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-6">
      {/* Input + presets */}
      <div className="flex flex-col gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Any CSS color — #hex, rgb(), oklch(), named..."
          size="md"
          leading={
            palette ? (
              <div
                className="size-4 rounded-full"
                style={{ backgroundColor: palette.shades[5]?.hex }}
              />
            ) : null
          }
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setInput(preset.value)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
            >
              <div
                className="size-2.5 rounded-full"
                style={{ backgroundColor: preset.value }}
              />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Palette output */}
      {palette ? (
        <div className="flex flex-col gap-2">
          <div className="flex h-12 overflow-hidden rounded-[var(--layout-radius-lg)]">
            {palette.shades.map((shade) => (
              <div
                key={shade.step}
                className="flex-1 transition-colors"
                style={{ backgroundColor: shade.hex }}
                title={`${shade.step}: ${shade.hex}`}
              />
            ))}
          </div>
          <div className="flex overflow-hidden">
            {palette.shades.map((shade) => (
              <span
                key={shade.step}
                className="flex-1 text-center font-mono text-[10px] text-muted-foreground"
              >
                {shade.step}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-12 items-center justify-center rounded-[var(--layout-radius-lg)] bg-muted">
          <span className="text-sm text-muted-foreground">
            Enter a valid CSS color
          </span>
        </div>
      )}
    </div>
  );
}
