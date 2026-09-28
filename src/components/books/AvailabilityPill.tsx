import { CircleCheck, CircleSlash, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export function AvailabilityPill({
  available,
  className,
}: {
  available: number;
  className?: string;
}) {
  const tone =
    available === 0
      ? "bg-danger-soft text-danger"
      : available <= 2
        ? "bg-amber-soft text-[oklch(0.55_0.13_65)]"
        : "bg-success-soft text-[oklch(0.5_0.12_162)]";
  const Icon = available === 0 ? CircleSlash : available <= 2 ? CircleAlert : CircleCheck;
  const label =
    available === 0
      ? "Currently unavailable"
      : available <= 2
        ? `${available} cop${available === 1 ? "y" : "ies"} left`
        : "Available";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
