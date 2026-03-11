"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { usePathname } from "next/navigation";

interface SidebarContextValue {
  /** Desktop inline sidebar visibility */
  open: boolean;
  /** Mobile overlay open state */
  mobileOpen: boolean;
  toggle: () => void;
  close: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  mobileOpen: false,
  toggle: () => {},
  close: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => {
    setOpen(false);
    setMobileOpen(false);
  }, []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Auto-close mobile overlay on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with Next.js router
    setMobileOpen(false);
  }, [pathname]);

  // Body scroll lock when mobile overlay is open — useLayoutEffect to avoid flash
  useLayoutEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <SidebarContext.Provider
      value={{ open, mobileOpen, toggle, close, toggleMobile, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
