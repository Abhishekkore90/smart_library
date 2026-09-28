import { cn } from "@/lib/utils";
import type { Book } from "@/lib/types";

const palettes: Record<string, string> = {
  "Computer Science": "from-[oklch(0.35_0.13_277)] to-[oklch(0.55_0.2_290)]",
  Engineering: "from-[oklch(0.3_0.06_250)] to-[oklch(0.45_0.11_230)]",
  Mathematics: "from-[oklch(0.33_0.09_200)] to-[oklch(0.52_0.12_195)]",
  Physics: "from-[oklch(0.3_0.07_265)] to-[oklch(0.48_0.15_300)]",
  Literature: "from-[oklch(0.35_0.11_25)] to-[oklch(0.55_0.15_45)]",
  Management: "from-[oklch(0.32_0.05_150)] to-[oklch(0.5_0.12_160)]",
  Psychology: "from-[oklch(0.34_0.1_330)] to-[oklch(0.55_0.14_350)]",
  History: "from-[oklch(0.33_0.07_80)] to-[oklch(0.52_0.13_70)]",
};

export function BookCover({ book, className }: { book: Book; className?: string }) {
  const palette = palettes[book.category] ?? palettes["Computer Science"];
  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-4 text-left",
        palette,
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-2 bg-[oklch(0_0_0/0.28)]" aria-hidden />
      <div
        className="absolute -right-8 -top-10 size-28 rounded-full bg-[oklch(1_0_0/0.09)]"
        aria-hidden
      />
      <div
        className="absolute -bottom-12 -left-6 size-32 rounded-full bg-[oklch(1_0_0/0.06)]"
        aria-hidden
      />
      <p className="relative pl-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(1_0_0/0.65)]">
        {book.category}
      </p>
      <div className="relative pl-2">
        <p className="font-display text-sm font-bold leading-snug text-[oklch(1_0_0/0.96)] line-clamp-4">
          {book.title}
        </p>
        <p className="mt-1 text-[11px] text-[oklch(1_0_0/0.65)] line-clamp-1">{book.author}</p>
      </div>
      <div className="relative pl-2 text-[10px] font-medium text-[oklch(1_0_0/0.5)]">
        {book.shelf}
      </div>
    </div>
  );
}
