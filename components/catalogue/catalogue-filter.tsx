"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SourceFilter = "all" | "tailwind" | "curated";

export function CatalogueFilter({
  search,
  onSearchChange,
  source,
  onSourceChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  source: SourceFilter;
  onSourceChange: (value: SourceFilter) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Input
        size="md"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search palettes..."
        aria-label="Search palettes"
        className="flex-1"
      />
      <Select
        value={source}
        onValueChange={(v) => onSourceChange(v as SourceFilter)}
      >
        <SelectTrigger className="w-[160px]" aria-label="Source filter">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="tailwind">Tailwind</SelectItem>
          <SelectItem value="curated">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
