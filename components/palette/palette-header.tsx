"use client";

import { useCopy } from "@/hooks/use-copy";
import { Button } from "@/components/ui/button";
import { FormatToggle } from "./format-toggle";
import type { Palette, ColorFormat } from "@/types/color";
import { formatColor } from "@/lib/color-formatter";

export function PaletteHeader({
  palette,
  format,
  onFormatChange,
  onExport,
}: {
  palette: Palette;
  format: ColorFormat;
  onFormatChange: (f: ColorFormat) => void;
  onExport?: () => void;
}) {
  const { copy } = useCopy();

  const handleShare = () => {
    copy(window.location.href, "Link copied");
  };

  const handleCopyAll = () => {
    if (!palette.shades) return;
    const lines = palette.shades.map((shade) => {
      const value = formatColor(shade.oklch, format === "cssvar" ? "hex" : format, palette.id, shade.step);
      return `  --color-${palette.id}-${shade.step}: ${value};`;
    });
    const output = `:root {\n${lines.join("\n")}\n}`;
    copy(output, `${palette.shades.length} color values`);
  };

  return (
    <div className="flex flex-col gap-[var(--layout-gap-lg)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-[var(--layout-gap-xs)]">
        <h1 className="text-heading-medium font-accent text-content-primary capitalize">
          {palette.name}
        </h1>
        <p className="text-content-note text-content-secondary">
          Generate OKLCH palettes with APCA contrast
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-[var(--layout-gap-md)]">
        <FormatToggle value={format} onChange={onFormatChange} />
        <Button variant="secondary" size="sm" onClick={handleShare}>
          <ShareIcon className="h-4 w-4" />
          Share
        </Button>
        <Button variant="secondary" size="sm" onClick={handleCopyAll}>
          <CopyIcon className="h-4 w-4" />
          Copy All
        </Button>
        {onExport && (
          <Button variant="secondary" size="sm" onClick={onExport}>
            <ExportIcon className="h-4 w-4" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1={12} y1={2} x2={12} y2={15} />
    </svg>
  );
}

function ExportIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1={12} y1={15} x2={12} y2={3} />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width={14} height={14} x={8} y={8} rx={2} />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
