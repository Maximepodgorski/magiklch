"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BiShuffle, BiLink } from "react-icons/bi";
import { generatePalette } from "@/lib/color-engine";
import { useCopy } from "@/hooks/use-copy";
import { toHex } from "@/lib/color-formatter";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  clamp,
  round,
  generateRandomParams,
  getHueLabel,
  getChromaLabel,
} from "@/lib/utils";
import type { OklchColor } from "@/types/color";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function RandomShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { copy } = useCopy();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const hasParams = searchParams.has("h") && searchParams.has("c");
  const h = clamp(Number(searchParams.get("h")) || 0, 0, 360);
  const c = clamp(Number(searchParams.get("c")) || 0.15, 0, 0.4);

  useEffect(() => {
    if (mounted && !hasParams) {
      const params = generateRandomParams();
      router.replace(`/random?h=${params.h}&c=${params.c}`, { scroll: false });
    }
  }, [mounted, hasParams, router]);

  const baseColor: OklchColor = useMemo(() => ({ l: 0.65, c, h }), [c, h]);
  const palette = useMemo(
    () => generatePalette(baseColor, "random"),
    [baseColor]
  );

  const [shuffleKey, setShuffleKey] = useState(0);

  const handleShuffle = useCallback(() => {
    setShuffleKey((k) => k + 1);
    const params = generateRandomParams();
    router.replace(`/random?h=${params.h}&c=${params.c}`, { scroll: false });
  }, [router]);

  const handleOpenInGenerator = useCallback(() => {
    router.push(`/?h=${h}&c=${c}&name=custom`);
  }, [router, h, c]);

  const handleShare = useCallback(() => {
    copy(window.location.href, "Link copied");
  }, [copy]);

  const hueLabel = getHueLabel(h);
  const chromaLabel = getChromaLabel(c);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <PageHeader
          icon={BiShuffle}
          title="Shuffle"
          subtitle="Discover random OKLCH palettes for inspiration."
          rightContent={
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
                onClick={handleShare}
                aria-label="Copy link"
              >
                <BiLink size={18} />
              </Button>
            </div>
          }
        />

        <div className="flex flex-col gap-7 px-10 py-7">
          {/* Palette info */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground">Hue</span>
              <span className="text-sm text-muted-foreground">
                {round(h, 1)}°
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Chroma
              </span>
              <span className="text-sm text-muted-foreground">
                {round(c, 3)}
              </span>
            </div>
            <Badge variant="neutral" size="sm" type="light">
              {hueLabel}, {chromaLabel}
            </Badge>
          </div>

          {/* Palette swatches */}
          {palette.shades && (
            <div key={shuffleKey} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${palette.shades.length}, 1fr)` }}>
              {palette.shades.map((shade, index) => (
                <Tooltip key={shade.step}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        copy(shade.cssOklch, `Shade ${shade.step}`)
                      }
                      className={`group/swatch relative aspect-square w-full cursor-pointer rounded-[var(--layout-radius-2xl)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${shade.oklch.l > 0.85 ? "border border-border" : ""}`}
                      style={{
                        backgroundColor: shade.hex,
                        forcedColorAdjust: "none",
                        animation: `swatch-pop 250ms cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 20}ms backwards`,
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
          )}
        </div>
      </div>

      {/* Shuffle footer */}
      <footer className="flex h-14 items-center justify-end border-t border-border px-5">
        <Button onClick={handleShuffle}>Shuffle</Button>
      </footer>
    </div>
  );
}
