import type { Metadata } from "next";
import { Suspense } from "react";
import { StealShell } from "@/components/steal/steal-shell";

export const metadata: Metadata = {
  title: "Steal — Extract Website Colors",
  description:
    "Extract any website's color palette as OKLCH. Drag the bookmarklet to your bookmarks bar, visit any site, and steal its colors in one click.",
  alternates: { canonical: "/steal" },
};

export default function StealPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 animate-pulse px-4 py-8 lg:px-10">
          <div className="h-10 w-48 rounded-[var(--layout-radius-lg)] bg-surface-secondary" />
        </div>
      }
    >
      <StealShell />
    </Suspense>
  );
}
