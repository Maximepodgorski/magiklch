"use client";

import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { LogoSvg } from "./logo-svg";
import { ThemePill } from "./theme-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--layout-radius-md)] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Left — Logo */}
      <Link href="/" className="flex items-center gap-2">
        <LogoSvg width={103} height={22} aria-label="MagicOK" />
        <Badge variant="neutral" size="sm" type="light">v1.0</Badge>
      </Link>

      {/* Right — GitHub + Theme */}
      <div className="flex items-center gap-[var(--layout-gap-md)]">
        <ThemePill />
        <Button variant="secondary" size="sm" asChild>
          <a href="https://github.com/maximepodgorski/magic-oklch" target="_blank" rel="noopener noreferrer">
            <BiLogoGithub size={16} />
            GitHub
          </a>
        </Button>
      </div>
    </header>
  );
}
