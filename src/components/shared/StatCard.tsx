import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "indigo" | "amber" | "success" | "navy" | "danger";

const tones: Record<Tone, string> = {
  indigo: "bg-indigo-soft text-indigo",
  amber: "bg-amber-soft text-[oklch(0.55_0.13_65)]",
  success: "bg-success-soft text-[oklch(0.5_0.12_162)]",
  navy: "bg-secondary text-navy",
  danger: "bg-danger-soft text-danger",
};

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, tone = "indigo", className }: StatCardProps) {
  return (
    <div className={cn("surface-card hover-lift flex items-start gap-4 p-5", className)}>
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
