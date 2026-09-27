import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";

import { AvailabilityPill } from "@/components/books/AvailabilityPill";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  const { favourites, toggleFavourite } = useLibrary();
  const isFav = favourites.includes(book.id);

  return (
    <article className="group surface-card hover-lift flex flex-col overflow-hidden p-3">
      <div className="relative overflow-hidden rounded-xl">
        <BookCover book={book} className="transition-transform duration-500 group-hover:scale-[1.06]" />
        <button
          type="button"
          onClick={() => {
            void toggleFavourite(book.id).then(added => toast.success(added ? "Added to favourites" : "Removed from favourites")).catch(error => toast.error(error.message));
          }}
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-[oklch(1_0_0/0.9)] text-muted-foreground shadow-[var(--shadow-soft)] transition hover:scale-105 hover:text-danger"
        >
          <Heart className={cn("size-4", isFav && "fill-danger text-danger")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1 pb-1 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-2">{book.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="size-3.5 fill-amber text-amber" />
            {book.rating}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-soft px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
            {book.category}
          </span>
          <AvailabilityPill available={book.availableCopies} />
        </div>
        <Button asChild size="sm" className="mt-auto w-full rounded-xl">
          <Link to={`/app/books/${book.id}`}>
            View details
          </Link>
        </Button>
      </div>
    </article>
  );
}
