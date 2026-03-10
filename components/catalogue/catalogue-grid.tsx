"use client";

import { useState, useMemo } from "react";
import { PalettePreview } from "./palette-preview";
import { CatalogueFilter } from "./catalogue-filter";
import { ALL_PALETTES, getStripeHex } from "@/data/all-palettes";
import type { Palette } from "@/types/color";

type SourceFilter = "all" | "tailwind" | "curated";

export function CatalogueGrid() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");

  const filtered = useMemo(() => {
    let result: Palette[] = ALL_PALETTES;

    if (source !== "all") {
      result = result.filter((p) => p.source === source);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    return result;
  }, [search, source]);

  return (
    <div className="flex flex-col gap-6">
      <CatalogueFilter
        search={search}
        onSearchChange={setSearch}
        source={source}
        onSourceChange={setSource}
      />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No palettes found
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((palette) => (
            <PalettePreview
              key={palette.id}
              palette={palette}
              stripeHex={getStripeHex(palette.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
