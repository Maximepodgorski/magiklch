"use client";

import { useMemo, useCallback, useRef, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generatePalette } from "@/lib/color-engine";
import { parseColor } from "@/lib/color-parser";
import { clamp } from "@/lib/utils";
import type { OklchColor, Palette } from "@/types/color";

const DEFAULT_HUE = 259;
const DEFAULT_CHROMA = 0.214;
const DEFAULT_LIGHTNESS = 0.65;
const DEFAULT_NAME = "blue";
const DEBOUNCE_MS = 300;

function parseParam(raw: string | null, fallback: number): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  return isNaN(n) ? fallback : n;
}

function parseUrlParams(searchParams: URLSearchParams) {
  const h = clamp(parseParam(searchParams.get("h"), DEFAULT_HUE), 0, 360);
  const c = clamp(parseParam(searchParams.get("c"), DEFAULT_CHROMA), 0, 0.4);
  const l = clamp(parseParam(searchParams.get("l"), DEFAULT_LIGHTNESS), 0, 1);
  const name = searchParams.get("name") || DEFAULT_NAME;

  return { h, c, l, name };
}

/**
 * URL-first palette state.
 * Must be used inside a Suspense boundary (useSearchParams requirement).
 */
export function usePalette() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { h, c, l, name } = parseUrlParams(searchParams);

  const baseColor: OklchColor = useMemo(() => ({ l, c, h }), [l, c, h]);

  const palette: Palette = useMemo(
    () => generatePalette(baseColor, name),
    [baseColor, name]
  );

  const updateUrl = useCallback(
    (params: { h?: number; c?: number; l?: number; name?: string }) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const next = new URLSearchParams(searchParams.toString());
        if (params.h !== undefined) next.set("h", String(params.h));
        if (params.c !== undefined) next.set("c", String(params.c));
        if (params.l !== undefined) next.set("l", String(params.l));
        if (params.name !== undefined) next.set("name", params.name);
        startTransition(() => {
          router.replace(`?${next.toString()}`, { scroll: false });
        });
      }, DEBOUNCE_MS);
    },
    [searchParams, router, startTransition]
  );

  const setFromColor = useCallback(
    (input: string, paletteName?: string) => {
      const parsed = parseColor(input);
      if (!parsed) return false;

      updateUrl({
        h: parsed.h,
        c: parsed.c,
        l: parsed.l,
        name: paletteName || name,
      });
      return true;
    },
    [updateUrl, name]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return {
    palette,
    baseColor,
    name,
    setFromColor,
    updateUrl,
    currentUrl: typeof window !== "undefined"
      ? window.location.href
      : "",
  };
}
