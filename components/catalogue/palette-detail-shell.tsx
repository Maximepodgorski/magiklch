"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BiLink } from "react-icons/bi";
import { generatePalette } from "@/lib/color-engine";
import { toCssOklch, toHex } from "@/lib/color-formatter";
import { useCopy } from "@/hooks/use-copy";
import {
  ExportFooter,
  type ExportFormat,
} from "@/components/layout/export-footer";
import { Button } from "@/components/ui/button";
import type { Palette } from "@/types/color";

export function PaletteDetailShell({
  palette,
}: {
  palette: Palette;
}) {
  const router = useRouter();
  const { copy } = useCopy();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");

  const generatedPalette = useMemo(
    () => generatePalette(palette.baseColor, palette.id),
    [palette.baseColor, palette.id]
  );

  const shades = useMemo(
    () => generatedPalette.shades ?? [],
    [generatedPalette.shades]
  );
  const sourceLabel =
    palette.source === "tailwind" ? "Tailwind" : "Custom";

  const handleOpenInGenerator = useCallback(() => {
    router.push(
      `/?h=${palette.baseColor.h}&c=${palette.baseColor.c}&name=${palette.id}`
    );
  }, [router, palette]);

  const handleCopyLink = useCallback(() => {
    copy(window.location.href, "Link copied");
  }, [copy]);

  const handleCopyVariables = useCallback(() => {
    if (shades.length === 0) return;

    const isCss = exportFormat === "css";
    const lines = shades.map((shade) => {
      const value = toCssOklch(shade.oklch);
      return isCss
        ? `  --color-${palette.id}-${shade.step}: ${value};`
        : `$color-${palette.id}-${shade.step}: ${value};`;
    });

    const output = isCss
      ? `:root {\n${lines.join("\n")}\n}`
      : lines.join("\n");

    copy(output, `${shades.length} OKLCH values`);
  }, [shades, exportFormat, palette.id, copy]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Custom header with color swatch */}
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between px-10 pt-8 pb-5">
            <div className="flex flex-col gap-3">
              <div
                className="h-8 w-8 rounded-[var(--layout-radius-md)]"
                style={{
                  backgroundColor: toHex(palette.baseColor),
                  forcedColorAdjust: "none",
                }}
              />
              <h1 className="font-[var(--font-family-heading)] text-[22px] font-semibold tracking-[-0.04em] capitalize text-foreground">
                {palette.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {sourceLabel} · {shades.length} shades
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenInGenerator}
              >
                Remix colors
              </Button>
              <Button
                variant="terciary"
                size="sm"
                isIconOnly
                onClick={handleCopyLink}
                aria-label="Copy link"
              >
                <BiLink size={18} />
              </Button>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        <div className="px-10 py-7">
          {/* 4-column shade grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shades.map((shade) => {
              const isLight = shade.oklch.l > 0.65;
              return (
                <button
                  key={shade.step}
                  onClick={() => copy(shade.cssOklch, `Shade ${shade.step}`)}
                  className={`group relative h-[130px] cursor-pointer overflow-hidden rounded-[var(--layout-radius-xl)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${shade.oklch.l > 0.85 ? "border border-border" : ""}`}
                  style={{
                    backgroundColor: shade.hex,
                    forcedColorAdjust: "none",
                  }}
                  aria-label={`Shade ${shade.step}: ${shade.cssOklch}`}
                >
                  {/* OKLCH label overlay */}
                  <span
                    className={`absolute bottom-2 left-2 rounded-[var(--layout-radius-md)] px-1.5 py-0.5 font-mono text-xs ${
                      isLight
                        ? "text-gray-900"
                        : "bg-black/20 text-white"
                    }`}
                  >
                    {shade.cssOklch}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ExportFooter
        format={exportFormat}
        onFormatChange={setExportFormat}
        onCopy={handleCopyVariables}
      />
    </div>
  );
}
