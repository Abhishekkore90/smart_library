import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useLibrary } from "@/lib/library-store";
import { BookCard } from "@/components/books/BookCard";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export function BrowseBooks() {
  const { books } = useLibrary();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All categories");
  const [availability, setAvailability] = useState("All books");
  const [sort, setSort] = useState("Most popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const categories = ["All categories", ...Array.from(new Set(books.map((b) => b.category)))];

  const filtered = useMemo(() => {
    return books
      .filter((b) => {
        const matchesQuery =
          !q ||
          [b.title, b.author, b.isbn, b.publisher, b.category, b.description]
            .join(" ")
            .toLowerCase()
            .includes(q.toLowerCase());

        const matchesCat = category === "All categories" || b.category === category;

        const matchesAvail =
          availability === "All books" ||
          (availability === "Available" ? b.availableCopies > 0 : b.availableCopies === 0);

        return matchesQuery && matchesCat && matchesAvail;
      })
      .sort((a, b) => {
        if (sort === "Newest") return b.year - a.year;
        if (sort === "Highest rated") return b.rating - a.rating;
        if (sort === "Alphabetical") return a.title.localeCompare(b.title);
        return b.popularity - a.popularity;
      });
  }, [books, q, category, availability, sort]);

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Explore the Collection"
        description="Search, filter, and discover titles across multiple academic disciplines."
      />

      {/* Filter and Search Bar */}
      <div className="surface-card space-y-4 p-4 sm:p-5 rounded-xl border border-border">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author, ISBN, or subject…"
            className="h-12 w-full rounded-lg border border-input bg-card pl-12 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <SlidersHorizontal className="size-4" /> Filters:
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 min-w-[140px] rounded-md border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="h-9 min-w-[130px] rounded-md border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="All books">All Availability</option>
            <option value="Available">Available Now</option>
            <option value="Unavailable">Checked Out</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 min-w-[130px] rounded-md border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="Most popular">Most Popular</option>
            <option value="Highest rated">Highest Rated</option>
            <option value="Newest">Newest Year</option>
            <option value="Alphabetical">Title (A-Z)</option>
          </select>

          <div className="ml-auto flex rounded-lg border border-border p-0.5 bg-secondary/50">
            <Button
              title="Grid view"
              size="icon"
              variant={view === "grid" ? "secondary" : "ghost"}
              className="size-8"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              title="List view"
              size="icon"
              variant={view === "list" ? "secondary" : "ghost"}
              className="size-8"
              onClick={() => setView("list")}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <strong className="text-foreground">{filtered.length}</strong> matching book
        {filtered.length === 1 ? "" : "s"}
      </p>

      {/* Results View */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No books match your criteria"
          description="Try clearing your search keyword or changing your category filter."
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Link
              key={b.id}
              to={`/app/books/${b.id}`}
              className="surface-card flex items-center gap-5 p-4 rounded-xl border border-border transition hover:border-primary group"
            >
              <div className="w-16 shrink-0">
                <BookCover book={b} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  by {b.author} · {b.category} · {b.year}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    b.availableCopies > 0
                      ? "bg-success-soft text-success"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {b.availableCopies > 0 ? `${b.availableCopies} available` : "Reserved"}
                </span>
                <p className="text-xs text-muted-foreground mt-1">Shelf: {b.shelf}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
