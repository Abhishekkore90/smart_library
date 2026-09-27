import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
  compact?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl gradient-indigo shadow-[var(--shadow-glow)]",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a1.8 1.8 0 0 0-1.6-1H5.5A1.5 1.5 0 0 1 4 16.5Z" className="text-primary-foreground" />
        <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a1.8 1.8 0 0 1 1.6-1h4.9a1.5 1.5 0 0 0 1.5-1.5Z" className="text-primary-foreground" />
        <circle cx="12" cy="11" r="1.6" className="text-amber" stroke="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ className, tone = "dark", showTagline = false, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      {!compact && (
        <div className="leading-tight">
          <p
            className={cn(
              "font-display text-[15px] font-bold tracking-[0.14em]",
              tone === "light" ? "text-navy-foreground" : "text-foreground",
            )}
          >
            SMART LIBRARY
          </p>
          {showTagline && (
            <p className={cn("text-[11px] font-medium tracking-wide", tone === "light" ? "text-navy-foreground/60" : "text-muted-foreground")}>
              Discover. Learn. Manage.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
