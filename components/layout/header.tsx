"use client";

import Link from "next/link";
import { BiLogoGithub, BiMenu } from "react-icons/bi";
import { LogoSvg } from "./logo-svg";
import { ThemePill } from "./theme-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

export function Header() {
  const { mobileOpen, toggleMobile } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 lg:px-5">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--layout-radius-md)] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Left — Hamburger (mobile) + Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className="flex size-11 cursor-pointer items-center justify-center rounded-[var(--layout-radius-md)] text-muted-foreground transition-colors hover:bg-[var(--background-neutral-faint-hover)] hover:text-foreground lg:hidden"
        >
          <BiMenu size={22} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <LogoSvg width={103} height={22} aria-label="Magiklch" />
          <Badge variant="neutral" size="sm" type="light">
            Beta
          </Badge>
        </Link>
      </div>

      {/* Right — GitHub + Theme */}
      <div className="flex items-center gap-[var(--layout-gap-md)]">
        <ThemePill />
        <Button variant="secondary" size="sm" asChild className="hidden sm:inline-flex">
          <a
            href="https://github.com/maximepodgorski/magic-oklch"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BiLogoGithub size={16} />
            GitHub
          </a>
        </Button>
        <Button variant="secondary" size="sm" isIconOnly asChild className="sm:hidden">
          <a
            href="https://github.com/maximepodgorski/magic-oklch"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <BiLogoGithub size={16} />
          </a>
        </Button>
      </div>
    </header>
  );
}
