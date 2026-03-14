"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiSolidPalette,
  BiSolidGridAlt,
  BiSolidBookOpen,
} from "react-icons/bi";
import {
  BiShuffle,
  BiSolidDroplet,
  BiSolidDashboard,
  BiLogoLinkedinSquare,
  BiLinkExternal,
} from "react-icons/bi";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import type { IconType } from "react-icons";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const mainNav: NavGroup[] = [
  {
    label: "Features",
    items: [
      { href: "/", label: "Generator", icon: BiSolidPalette },
      { href: "/steal", label: "Steal", icon: BiSolidDroplet },
      { href: "/blocks", label: "Blocks", icon: BiSolidDashboard },
    ],
  },
  {
    label: "Explore",
    items: [
      { href: "/catalogue", label: "Catalogue", icon: BiSolidGridAlt },
      { href: "/random", label: "Shuffle", icon: BiShuffle },
    ],
  },
];

const bottomNav: NavItem[] = [
  { href: "/docs", label: "Docs", icon: BiSolidBookOpen },
  {
    href: "https://ui.getlyse.com/components/introduction",
    label: "Built with Lyse",
    icon: BiLinkExternal,
  },
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

function SidebarContent() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-4 p-3" aria-label="Main">
        {mainNav.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="px-3 pb-1 text-content-caption font-accent text-muted-foreground">
              {group.label}
            </span>
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border">
        <nav
          className="flex flex-col gap-0.5 px-3 pb-3 pt-3"
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
    </>
  );
}

/** Desktop inline sidebar — hidden below lg via CSS, no JS flash */
export function AppSidebar() {
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] lg:flex">
      <SidebarContent />
    </aside>
  );
}

/** Mobile overlay drawer — rendered via portal-like fixed positioning */
export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = closeMobile;

  // Focus trap + Escape handler
  useEffect(() => {
    if (!mobileOpen) {
      // Restore focus to trigger element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      return;
    }

    // Store the element that triggered the open
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the sidebar
    const sidebar = sidebarRef.current;
    if (sidebar) {
      const firstFocusable = sidebar.querySelector<HTMLElement>(
        "a, button, [tabindex]:not([tabindex='-1'])"
      );
      firstFocusable?.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && sidebar) {
        const focusable = sidebar.querySelectorAll<HTMLElement>(
          "a, button, [tabindex]:not([tabindex='-1'])"
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, closeMobile]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 lg:hidden",
        mobileOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200 motion-reduce:transition-none",
          mobileOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-sidebar"
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "absolute inset-y-0 left-0 flex w-56 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] shadow-xl transition-transform duration-200",
          "motion-reduce:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
    </div>
  );
}
