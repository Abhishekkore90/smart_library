import { useState } from "react";
import { History, Search } from "lucide-react";
import { useLibrary } from "@/lib/library-store";
import { daysBetween, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export function ReadingHistory() {
  const { history, getBook } = useLibrary();
  const [q, setQ] = useState("");

  const filtered = history.filter((h) => {
    const book = getBook(h.bookId);
    return `${book?.title} ${book?.author}`.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Borrowing & Reading History"
        description="A complete chronological log of books you have checked out and returned."
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search history by title or author…"
          className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history records found"
          description="Books you check out and return will appear here automatically."
        />
      ) : (
        <div className="surface-card divide-y divide-border rounded-xl border border-border overflow-hidden">
          {filtered.map((h) => {
            const book = getBook(h.bookId);
            return (
              <div
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-secondary/30 transition"
              >
                <div>
                  <p className="font-semibold text-foreground">{book?.title || "Library Book"}</p>
                  <p className="text-sm text-muted-foreground">{book?.author || "Unknown"}</p>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-3">
                  <span>
                    Issued: {formatDate(h.issueDate)} → Returned: {formatDate(h.returnDate)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-xs font-semibold text-foreground">
                    {daysBetween(h.issueDate, h.returnDate)} days
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
