"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import type { Palette, PaletteShade } from "@/types/color";

type ExportFormat = "css" | "json" | "scss" | "tailwind" | "cssInJs";

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "scss", label: "SCSS" },
  { value: "tailwind", label: "Tailwind" },
  { value: "cssInJs", label: "CSS-in-JS" },
];

/** Sanitize name into a valid JS identifier: camelCase, no leading digits */
function toJsIdentifier(name: string): string {
  const parts = name.split(/[-_\s]+/).filter(Boolean);
  return parts
    .map((p, i) => (i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()))
    .join("")
    .replace(/^(\d)/, "_$1");
}

function generateExport(
  shades: PaletteShade[],
  name: string,
  format: ExportFormat
): string {
  const entries = shades.map((s) => ({ step: s.step, hex: s.hex }));

  switch (format) {
    case "css": {
      const lines = entries.map((e) => `  --color-${name}-${e.step}: ${e.hex};`);
      return `:root {\n${lines.join("\n")}\n}`;
    }
    case "json": {
      const obj: Record<string, string> = {};
      entries.forEach((e) => { obj[String(e.step)] = e.hex; });
      return JSON.stringify(obj, null, 2);
    }
    case "scss": {
      const pairs = entries.map((e) => `  ${e.step}: ${e.hex}`);
      return `$palette-${name}: (\n${pairs.join(",\n")}\n);`;
    }
    case "tailwind": {
      const obj: Record<string, string> = {};
      entries.forEach((e) => { obj[String(e.step)] = e.hex; });
      return JSON.stringify({ colors: { [name]: obj } }, null, 2);
    }
    case "cssInJs": {
      const jsName = toJsIdentifier(name);
      const pairs = entries.map((e) => `  "${e.step}": "${e.hex}"`);
      return `const ${jsName} = {\n${pairs.join(",\n")}\n};`;
    }
  }
}

export function ExportPalette({
  palette,
  open,
  onClose,
  className,
}: {
  palette: Palette;
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const { copy } = useCopy();

  const output = useMemo(() => {
    if (!palette.shades) return "";
    return generateExport(palette.shades, palette.id, format);
  }, [palette.shades, palette.id, format]);

  const handleCopy = useCallback(() => {
    const label = `${palette.shades?.length ?? 0} color values as ${FORMATS.find((f) => f.value === format)?.label}`;
    copy(output, label);
  }, [copy, output, format, palette.shades?.length]);

  if (!open || !palette.shades) return null;

  return (
    <div
      className={cn(
        "rounded-[var(--layout-radius-xl)] border border-border-secondary bg-surface-primary p-[var(--layout-padding-lg)]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-[var(--layout-gap-md)]">
        <h3 className="text-content-body font-accent text-content-primary">
          Export Palette
        </h3>
        <button
          onClick={onClose}
          className="text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
          aria-label="Close export panel"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Format selector */}
      <div
        role="tablist"
        aria-label="Export format"
        className="inline-flex items-center gap-[var(--layout-gap-xs)] rounded-[var(--layout-radius-lg)] bg-surface-secondary p-[var(--layout-padding-2xs)] mb-[var(--layout-gap-md)]"
      >
        {FORMATS.map(({ value: fmt, label }) => (
          <button
            key={fmt}
            role="tab"
            aria-selected={format === fmt}
            onClick={() => setFormat(fmt)}
            className={cn(
              "rounded-[var(--layout-radius-md)] px-[var(--layout-padding-md)] py-[var(--layout-padding-xs)] text-content-caption font-accent transition-colors cursor-pointer",
              format === fmt
                ? "bg-surface-primary text-content-primary shadow-sm"
                : "text-content-secondary hover:text-content-primary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Code preview */}
      <pre className="overflow-x-auto rounded-[var(--layout-radius-lg)] bg-surface-secondary p-[var(--layout-padding-md)] text-content-caption font-mono text-content-primary mb-[var(--layout-gap-md)] max-h-64">
        <code>{output}</code>
      </pre>

      {/* Copy button */}
      <Button variant="primary" size="sm" onClick={handleCopy}>
        <CopyIcon className="h-4 w-4" />
        Copy
      </Button>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
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
