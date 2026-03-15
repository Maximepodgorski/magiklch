"use client";

import { useRef, useEffect, useState, useMemo, useCallback, useDeferredValue } from "react";
import { BiSolidPlusCircle } from "react-icons/bi";
import { usePalette } from "@/hooks/use-palette";
import { useCopy } from "@/hooks/use-copy";
import { generatePalette } from "@/lib/color-engine";
import { toCssOklch, toHex } from "@/lib/color-formatter";
import { PageHeader } from "@/components/layout/page-header";
import {
  ExportFooter,
  type ExportFormat,
} from "@/components/layout/export-footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { round } from "@/lib/utils";
import { ColorInput } from "./color-input";
import { LchSliders } from "./lch-sliders";
import { ContrastGrid } from "./contrast-grid";
import type { OklchColor, ShadeStep, PaletteShade } from "@/types/color";

type Scale = 4 | 6 | 8 | 10 | 11 | 12;
type GamutMode = "srgb" | "p3";

const SCALE_OPTIONS: Scale[] = [4, 6, 8, 10, 11, 12];

const SCALE_STEPS: Record<Scale, ShadeStep[]> = {
  4: [200, 400, 600, 800],
  6: [100, 300, 500, 700, 800, 950],
  8: [50, 200, 300, 500, 600, 700, 800, 950],
  10: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  11: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  12: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975],
};

interface LiveState {
  color: OklchColor;
  base: OklchColor;
}

function isSameColor(a: OklchColor, b: OklchColor) {
  return a.l === b.l && a.c === b.c && a.h === b.h;
}

function filterShades(shades: PaletteShade[], scale: Scale): PaletteShade[] {
  const steps = SCALE_STEPS[scale];
  return shades.filter((s) => steps.includes(s.step));
}

export function GeneratorShell() {
  const { palette, baseColor, name, setFromColor, updateUrl } = usePalette();
  const { copy } = useCopy();
  const prevNameRef = useRef(palette.name);
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const [scale, setScale] = useState<Scale>(12);
  const [gamut, setGamut] = useState<GamutMode>("srgb");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");

  const activeColor =
    liveState && isSameColor(liveState.base, baseColor)
      ? liveState.color
      : baseColor;

  const activePalette = useMemo(
    () =>
      liveState && isSameColor(liveState.base, baseColor)
        ? generatePalette(liveState.color, name)
        : palette,
    [liveState, baseColor, name, palette]
  );

  const visibleShades = useMemo(
    () => (activePalette.shades ? filterShades(activePalette.shades, scale) : []),
    [activePalette.shades, scale]
  );

  const deferredShades = useDeferredValue(visibleShades);

  const handleSliderLive = useCallback(
    (params: { h?: number; c?: number; l?: number }) => {
      setLiveState((prev) => {
        const base = prev?.color ?? baseColor;
        return {
          color: {
            l: params.l ?? base.l,
            c: params.c ?? base.c,
            h: params.h ?? base.h,
          },
          base: baseColor,
        };
      });
    },
    [baseColor]
  );

  const handleSliderCommit = useCallback(
    (color?: OklchColor) => {
      const c = color ?? liveState?.color;
      if (c) updateUrl({ h: c.h, c: c.c, l: c.l });
    },
    [liveState, updateUrl]
  );

  const handleCopyVariables = useCallback(() => {
    if (visibleShades.length === 0) return;

    const isCss = exportFormat === "css";
    const lines = visibleShades.map((shade) => {
      const value = toCssOklch(shade.oklch);
      return isCss
        ? `  --color-${activePalette.id}-${shade.step}: ${value};`
        : `$color-${activePalette.id}-${shade.step}: ${value};`;
    });

    const output = isCss
      ? `:root {\n${lines.join("\n")}\n}`
      : lines.join("\n");

    copy(output, `${visibleShades.length} OKLCH values`);
  }, [visibleShades, exportFormat, activePalette.id, copy]);

  useEffect(() => {
    if (activePalette.name !== prevNameRef.current) {
      prevNameRef.current = activePalette.name;
      const live = document.getElementById("copy-live");
      if (live) live.textContent = `Palette updated: ${activePalette.name}`;
    }
  }, [activePalette.name]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <PageHeader
          icon={BiSolidPlusCircle}
          title="Generator"
          subtitle="Generate OKLCH palettes with APCA contrast scoring."
        />

        <div className="flex flex-col gap-7 px-4 py-7 lg:px-10">
          {/* Controls row */}
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-6">
            {/* Seed Color */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-foreground">
                Seed Color
              </span>
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 shrink-0 rounded-[var(--layout-radius-md)]"
                  style={{
                    backgroundColor: toHex(activeColor),
                    forcedColorAdjust: "none",
                  }}
                />
                <ColorInput
                  defaultValue={toHex(baseColor)}
                  externalValue={toHex(activeColor)}
                  onColorChange={(color) => setFromColor(color)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Shades */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-foreground">
                Shades
              </span>
              <Select
                value={String(scale)}
                onValueChange={(v) => setScale(Number(v) as Scale)}
              >
                <SelectTrigger className="w-full" aria-label="Shades">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCALE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {String(n)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gamut */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-foreground">
                Gamut
              </span>
              <Select
                value={gamut}
                onValueChange={(v) => setGamut(v as GamutMode)}
              >
                <SelectTrigger className="w-full" aria-label="Gamut">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="srgb">sRGB</SelectItem>
                  <SelectItem value="p3">Display P3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sliders */}
          <LchSliders
            baseColor={activeColor}
            onLiveChange={handleSliderLive}
            onCommit={handleSliderCommit}
          />

          {/* Palette tabs: Shades / Contrast */}
          <Tabs defaultValue="shades" variant="pill" size="md">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="shades">Shades</TabsTrigger>
                <TabsTrigger value="contrast">Contrast</TabsTrigger>
              </TabsList>

              <Button
                variant="terciary"
                size="sm"
                asChild
              >
                <Link
                  href={`/blocks?brand=custom&h=${round(activeColor.h, 1)}&c=${round(activeColor.c)}`}
                >
                  Preview in Blocks
                </Link>
              </Button>
            </div>

            <TabsContent value="shades">
              {visibleShades.length > 0 ? (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${visibleShades.length}, minmax(44px, 1fr))` }}>
                  {visibleShades.map((shade) => (
                    <Tooltip key={shade.step}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => copy(shade.cssOklch, `Shade ${shade.step}`)}
                          className={`group/swatch relative aspect-square w-full cursor-pointer rounded-[var(--layout-radius-2xl)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${shade.oklch.l > 0.85 ? "border border-border" : ""}`}
                          style={{
                            backgroundColor:
                              gamut === "p3" ? shade.cssOklch : shade.hex,
                            forcedColorAdjust: "none",
                          }}
                          aria-label={`Shade ${shade.step}: ${shade.cssOklch}`}
                        >
                          <span className={`absolute top-2 left-2 rounded-[var(--layout-radius-md)] px-1.5 py-0.5 font-mono text-xs opacity-0 transition-opacity group-hover/swatch:opacity-100 ${shade.oklch.l > 0.65 ? "text-gray-900" : "bg-black/20 text-white"}`}>
                            {shade.step}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" size="sm" className="max-w-none whitespace-nowrap">
                        <span className="font-mono">{shade.cssOklch}</span>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="contrast">
              <ContrastGrid shades={deferredShades} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ExportFooter
        format={exportFormat}
        onFormatChange={setExportFormat}
        onCopy={handleCopyVariables}
      />

      <div
        id="copy-live"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}
