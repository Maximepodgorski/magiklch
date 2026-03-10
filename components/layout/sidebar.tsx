"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiSolidPalette,
  BiSolidGridAlt,
  BiSolidBookOpen,
} from "react-icons/bi";
import { BiShuffle, BiLogoLinkedinSquare } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import type { IconType } from "react-icons";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

const mainNav: NavItem[] = [
  { href: "/", label: "Generator", icon: BiSolidPalette },
  { href: "/catalogue", label: "Catalogue", icon: BiSolidGridAlt },
  { href: "/random", label: "Shuffle", icon: BiShuffle },
];

const bottomNav: NavItem[] = [
  { href: "/docs", label: "Docs", icon: BiSolidBookOpen },
  {
    href: "https://www.linkedin.com/in/maxime-podgorski/",
    label: "LinkedIn",
    icon: BiLogoLinkedinSquare,
  },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const isExternal = item.href.startsWith("http");
  const Component = isExternal ? "a" : Link;
  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Component
      href={item.href}
      {...externalProps}
      className={cn(
        "flex items-center gap-2.5 rounded-[var(--layout-radius-lg)] px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
          : "text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
      )}
    >
      <item.icon size={18} className="shrink-0" />
      <span>{item.label}</span>
    </Component>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  if (!open) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)]">
      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border">
        <nav
          className="flex flex-col gap-0.5 px-3 pb-3 pt-2"
          aria-label="Resources"
        >
          {bottomNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
