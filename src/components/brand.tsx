import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Offset "Y" star mark. */
export function YMark({ className, label = true }: { className?: string; label?: boolean }) {
  return (
    <span className={cn("relative inline-flex h-10 w-10 items-center justify-center", className)} aria-hidden={!label}>
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" aria-hidden>
        <polygon
          points="20,2 24.5,14.5 38,15 27.5,23.5 31,37 20,29.5 9,37 12.5,23.5 2,15 15.5,14.5"
          className="fill-cardinal"
          transform="translate(3 2)"
        />
      </svg>
      <span className="relative font-display text-2xl text-paper">Y</span>
      {label && <span className="sr-only">The Yard Studio</span>}
    </span>
  );
}

export function DemoBadge({ children = "Demo / concept", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-1 rounded-sm border border-current px-1.5 py-0.5 font-semibold", className)}>
      {children}
    </span>
  );
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow: string; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b-2 border-ink pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow text-cardinal">{eyebrow}</p>
        <h1 className="font-display mt-2 text-5xl text-navy md:text-7xl">{title}</h1>
        {children && <div className="mt-3 text-base text-muted-foreground">{children}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-md border-2 border-dashed border-border bg-card p-8 text-center">
      <p className="font-display text-2xl text-navy">{title}</p>
      {children && <div className="mt-2 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
