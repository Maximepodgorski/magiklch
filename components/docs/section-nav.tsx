"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionNavProps {
  sections: { id: string; label: string }[];
}

export function SectionNav({ sections }: SectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const scrollRoot = document.getElementById("main-content");
    if (!scrollRoot) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: scrollRoot,
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="sticky top-10 hidden xl:flex flex-col gap-1"
      aria-label="Page sections"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(id)}
          className={cn(
            "cursor-pointer text-left text-[12px] leading-tight py-1 pl-3 border-l-2 transition-colors",
            activeId === id
              ? "border-foreground text-foreground font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
