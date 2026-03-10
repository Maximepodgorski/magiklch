"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { BiDesktop } from "react-icons/bi";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const modes = [
  { value: "light", icon: BiSolidSun, label: "Light mode" },
  { value: "dark", icon: BiSolidMoon, label: "Dark mode" },
  { value: "system", icon: BiDesktop, label: "System mode" },
] as const;

export function ThemePill() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div className="flex items-center gap-0 rounded-full border border-border bg-[var(--background-neutral-faint-default)] p-[2px]">
      {modes.map(({ value, icon: Icon, label }) => {
        const isActive = mounted && theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={isActive}
            className={cn(
              "flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
