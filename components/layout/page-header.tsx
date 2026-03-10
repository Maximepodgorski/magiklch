import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon: IconType;
  title: string;
  subtitle: string;
  iconBg?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  iconBg = "bg-muted",
  rightContent,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-end justify-between px-10 pt-8 pb-5">
        <div className="flex flex-col">
          <div
            className={cn(
              "mb-2.5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-border",
              iconBg
            )}
          >
            <Icon size={20} className="text-foreground" />
          </div>
          <h1 className="font-[var(--font-family-heading)] text-[22px] font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
      <div className="h-px bg-border" />
    </div>
  );
}
