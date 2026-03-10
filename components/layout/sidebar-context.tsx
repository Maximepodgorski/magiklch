"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
