import type { Metadata } from "next";
import { Suspense } from "react";
import { RandomShell } from "@/components/random/random-shell";
import { PaletteSkeleton } from "@/components/palette/palette-skeleton";

export const metadata: Metadata = {
  title: "Shuffle — MagicOK",
  description:
    "Generate random OKLCH color palettes for inspiration. Shuffle until you find one you love.",
};

export default function RandomPage() {
  return (
    <Suspense fallback={<PaletteSkeleton />}>
      <RandomShell />
    </Suspense>
  );
}
