import type { Metadata } from "next";
import { BiSolidPalette } from "react-icons/bi";
import { PageHeader } from "@/components/layout/page-header";
import { CatalogueGrid } from "@/components/catalogue/catalogue-grid";

export const metadata: Metadata = {
  title: "OKLCH Palette Catalogue",
  description:
    "Browse 29 ready-to-use OKLCH color palettes: 22 Tailwind-inspired and 7 custom. Each palette has 11 perceptually uniform shades with contrast scores.",
  alternates: { canonical: "/catalogue" },
};

export default function CataloguePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader
        icon={BiSolidPalette}
        title="Catalogue"
        subtitle="Browse Tailwind-inspired and custom OKLCH palettes."
        iconBg="bg-muted"
      />
      <div className="px-4 py-7 lg:px-10">
        <CatalogueGrid />
      </div>
    </div>
  );
}
