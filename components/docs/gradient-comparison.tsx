"use client";

const PAIRS = [
  { hsl: [0, 180], oklch: [25, 195] },
  { hsl: [240, 60], oklch: [265, 90] },
  { hsl: [300, 120], oklch: [305, 150] },
  { hsl: [30, 180], oklch: [55, 175] },
];

export function GradientComparison() {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--layout-radius-xl)] border border-border bg-[var(--background-neutral-faint-default)] p-6">
      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4">
        <span className="text-[13px] font-medium text-muted-foreground">
          HSL
        </span>
        <span className="text-[13px] font-medium text-muted-foreground">
          OKLCH
        </span>
      </div>

      {/* Gradient rows */}
      <div className="flex flex-col gap-3">
        {PAIRS.map((pair, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <div
              className="h-10 rounded-[var(--layout-radius-md)]"
              style={{
                background: `linear-gradient(to right in hsl, hsl(${pair.hsl[0]}, 100%, 50%), hsl(${pair.hsl[1]}, 100%, 50%))`,
              }}
            />
            <div
              className="h-10 rounded-[var(--layout-radius-md)]"
              style={{
                background: `linear-gradient(to right in oklch, oklch(0.7 0.2 ${pair.oklch[0]}), oklch(0.7 0.2 ${pair.oklch[1]}))`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
