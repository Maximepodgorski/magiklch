"use client";

import { useMemo, useState, useCallback } from "react";
import { buildContrastMatrix } from "@/lib/contrast-matrix";
import { getContrastLevel } from "@/lib/contrast";
import { useCopy } from "@/hooks/use-copy";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table/table";
import type { PaletteShade, ContrastLevel } from "@/types/color";

const LEVEL_LABEL: Record<ContrastLevel, string> = {
  AAA: "Body",
  AA: "Body",
  A: "Large",
  Fail: "Fail",
};

interface HoveredCell {
  row: number;
  col: number;
}

export function ContrastGrid({
  shades,
}: {
  shades: PaletteShade[];
}) {
  const [hovered, setHovered] = useState<HoveredCell | null>(null);
  const { copy } = useCopy();

  const matrix = useMemo(() => buildContrastMatrix(shades), [shades]);

  const handleCellAction = useCallback(
    (row: number, col: number) => {
      if (row === col) return;
      const textShade = shades[row];
      const bgShade = shades[col];
      const lc = matrix.values[row][col];
      const level = getContrastLevel(lc);
      const label = LEVEL_LABEL[level];

      const css = `/* ${textShade.step} on ${bgShade.step} — Lc ${Math.round(lc)} ${label} */\ncolor: ${textShade.cssOklch};\nbackground-color: ${bgShade.cssOklch};`;
      copy(css, "contrast pair");
    },
    [shades, matrix, copy]
  );

  if (shades.length === 0) {
    return (
      <div data-slot="contrast-grid" className="flex items-center justify-center rounded-[var(--layout-radius-lg)] border border-dashed border-border px-6 py-12">
        <p className="text-sm text-muted-foreground">
          Generate a palette first to see the contrast grid.
        </p>
      </div>
    );
  }

  const hoveredData = hovered
    ? {
        text: shades[hovered.row],
        bg: shades[hovered.col],
        lc: matrix.values[hovered.row][hovered.col],
        level: getContrastLevel(matrix.values[hovered.row][hovered.col]),
        isDiagonal: hovered.row === hovered.col,
      }
    : null;

  return (
    <div data-slot="contrast-grid" className="flex flex-col gap-4">
      {/* Preview panel — fixed height to prevent layout shift */}
      <div className="h-[128px]">
        {hoveredData && !hoveredData.isDiagonal ? (
          <div className="flex h-full items-center gap-4 rounded-[var(--layout-radius-lg)] border border-border p-4">
            <div
              className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--layout-radius-md)] px-6 py-3"
              style={{
                color: hoveredData.text.hex,
                backgroundColor: hoveredData.bg.hex,
                forcedColorAdjust: "none",
              }}
            >
              <span className="text-2xl font-semibold leading-none">Aa</span>
              <span className="text-sm leading-none">The quick brown fox</span>
              <span className="text-[10px] leading-none">12px caption</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-sm text-muted-foreground">
                {hoveredData.text.step} on {hoveredData.bg.step}
              </span>
              <span className="font-mono text-lg font-semibold text-foreground">
                Lc {Math.round(hoveredData.lc)}
              </span>
              <span
                className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                  hoveredData.level === "AAA" || hoveredData.level === "AA"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : hoveredData.level === "A"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                }`}
              >
                {hoveredData.level === "AAA" || hoveredData.level === "AA"
                  ? "Body text"
                  : hoveredData.level === "A"
                    ? "Large text only"
                    : "Decorative only"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-[var(--layout-radius-lg)] border border-dashed border-border">
            <span className="text-sm text-muted-foreground">
              Hover or focus a cell to preview the contrast pair
            </span>
          </div>
        )}
      </div>

      {/* Matrix table using Lyse Table */}
      <Table compact>
        <TableHeader>
          <TableRow>
            <TableHead align="center" className="sticky left-0 z-10 !bg-[var(--background-base-default)]">
              <span className="text-[10px] leading-tight" aria-hidden="true">Text \ Bg</span>
            </TableHead>
            {matrix.steps.map((step) => (
              <TableHead key={step} scope="col" align="center">
                {step}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {matrix.steps.map((rowStep, rowIdx) => (
            <TableRow key={rowStep} className="!bg-transparent hover:!bg-transparent">
              <TableCell
                align="center"
                className="sticky left-0 z-10 !bg-[var(--background-base-default)] !border-l-transparent font-mono font-medium !text-[var(--text-base-moderate)]"
              >
                {rowStep}
              </TableCell>
              {matrix.steps.map((colStep, colIdx) => {
                const isDiagonal = rowIdx === colIdx;
                const lc = matrix.values[rowIdx][colIdx];
                const level = isDiagonal ? null : getContrastLevel(lc);
                const label = level ? LEVEL_LABEL[level] : null;
                const isPass = level === "AAA" || level === "AA";
                const isHovered =
                  hovered?.row === rowIdx && hovered?.col === colIdx;

                return (
                  <TableCell
                    key={colStep}
                    align="center"
                    className={`!p-0 ${isPass && !isDiagonal ? "!bg-green-500/5" : "!bg-[var(--background-neutral-faint-default)]"} ${isHovered ? "ring-2 ring-inset ring-ring" : ""}`}
                  >
                    {isDiagonal ? (
                      <span className="flex h-[44px] items-center justify-center text-xs text-muted-foreground/40">
                        —
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="flex h-[44px] w-full cursor-pointer flex-col items-center justify-center gap-0.5 px-1 transition-colors hover:bg-[var(--background-neutral-faint-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                        onClick={() => handleCellAction(rowIdx, colIdx)}
                        onMouseEnter={() =>
                          setHovered({ row: rowIdx, col: colIdx })
                        }
                        onFocus={() =>
                          setHovered({ row: rowIdx, col: colIdx })
                        }
                        onMouseLeave={() => setHovered(null)}
                        onBlur={() => setHovered(null)}
                        aria-label={`Text ${rowStep} on background ${colStep}: Lc ${Math.round(lc)}, ${label === "Body" ? "body text" : label === "Large" ? "large text" : "fail"}`}
                      >
                        <span
                          className={`font-mono text-xs font-semibold ${
                            isPass
                              ? "text-foreground"
                              : level === "A"
                                ? "text-muted-foreground"
                                : "text-muted-foreground/50"
                          }`}
                        >
                          {Math.round(lc)}
                        </span>
                        <span
                          className={`text-[9px] leading-none ${
                            isPass
                              ? "text-green-600 dark:text-green-400"
                              : level === "A"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground/40"
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}
