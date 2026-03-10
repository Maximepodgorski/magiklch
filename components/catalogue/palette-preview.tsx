"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Palette } from "@/types/color";

export function PalettePreview({
  palette,
  stripeHex,
  className,
}: {
  palette: Palette;
  stripeHex: string[];
  className?: string;
}) {
  const sourceLabel =
    palette.source === "tailwind" ? "Tailwind" : "Custom";
  const sourceVariant = "neutral" as const;

  return (
    <Link
      href={`/catalogue/${palette.id}`}
      aria-label={`${palette.name} palette, ${sourceLabel}, ${stripeHex.length} shades`}
      className={cn(
        "group overflow-hidden rounded-[var(--layout-radius-xl)] border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      {/* Continuous color strip */}
      <div className="flex h-10" aria-hidden="true">
        {stripeHex.map((hex, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: hex, forcedColorAdjust: "none" }}
          />
        ))}
      </div>

      {/* Name + source label */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-sm font-medium text-foreground capitalize">
          {palette.name}
        </span>
        <Badge variant={sourceVariant} size="sm" type="light">
          {sourceLabel}
        </Badge>
      </div>
    </Link>
  );
}
