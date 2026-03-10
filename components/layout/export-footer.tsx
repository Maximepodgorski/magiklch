"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ExportFormat = "css" | "scss";

interface ExportFooterProps {
  format: ExportFormat;
  onFormatChange: (value: ExportFormat) => void;
  onCopy: () => void;
  copyLabel?: string;
}

export function ExportFooter({
  format,
  onFormatChange,
  onCopy,
  copyLabel = "Copy Variables",
}: ExportFooterProps) {
  return (
    <footer className="flex h-14 shrink-0 items-center justify-end gap-2 border-t border-border px-5">
      <Select value={format} onValueChange={(v) => onFormatChange(v as ExportFormat)}>
        <SelectTrigger className="w-[140px]" aria-label="Export format">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="css">CSS</SelectItem>
          <SelectItem value="scss">SCSS</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" onClick={onCopy}>
        {copyLabel}
      </Button>
    </footer>
  );
}
