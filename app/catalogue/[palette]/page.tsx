import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPaletteById } from "@/data/all-palettes";
import { PaletteDetailShell } from "@/components/catalogue/palette-detail-shell";

interface Props {
  params: Promise<{ palette: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { palette: id } = await params;
  const palette = getPaletteById(id);
  if (!palette) return { title: "Not Found — MagicOK" };

  return {
    title: `${palette.name} — MagicOK`,
    description: `Explore the ${palette.name} OKLCH palette with ${palette.source === "tailwind" ? "Tailwind" : "custom"} shades.`,
  };
}

export default async function PaletteDetailPage({ params }: Props) {
  const { palette: id } = await params;
  const palette = getPaletteById(id);

  if (!palette) notFound();

  return (
    <PaletteDetailShell palette={palette} />
  );
}
