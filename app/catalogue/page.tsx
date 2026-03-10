import type { Metadata } from "next";
import { BiSolidGridAlt } from "react-icons/bi";
import { PageHeader } from "@/components/layout/page-header";
import { CatalogueGrid } from "@/components/catalogue/catalogue-grid";

export const metadata: Metadata = {
  title: "Catalogue — MagicOK",
  description:
    "Browse 22 Tailwind-inspired and 7 curated OKLCH palettes. Click any palette to open it in the generator.",
};

export default function CataloguePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader
        icon={BiSolidGridAlt}
        title="Catalogue"
        subtitle="Browse Tailwind-inspired and curated OKLCH palettes."
        iconBg="bg-muted"
      />
      <div className="px-10 py-7">
        <CatalogueGrid />
      </div>
    </div>
  );
}
