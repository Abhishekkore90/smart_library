import { Link } from "react-router-dom";
import { BookOpenCheck, CalendarClock } from "lucide-react";
import { useLibrary } from "@/lib/library-store";
import { daysUntil, formatDate } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export function MyBooks({ dueOnly = false }: { dueOnly?: boolean }) {
  const { issued, getBook } = useLibrary();

  const shown = dueOnly ? issued.filter((x) => daysUntil(x.dueDate) <= 7) : issued;

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title={dueOnly ? "Upcoming Due Dates" : "My Issued Books"}
        description={
          dueOnly
            ? "Monitor books that require return or renewal within the next 7 days."
            : "All titles currently checked out to your library account."
        }
      />

      {shown.length === 0 ? (
        <EmptyState
          icon={dueOnly ? CalendarClock : BookOpenCheck}
          title={dueOnly ? "No impending due dates" : "No books checked out"}
          description={
            dueOnly
              ? "You have no books due in the next 7 days."
              : "Browse our catalog to borrow textbooks, literature, and reference materials."
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {shown.map((item) => {
            const book = getBook(item.bookId);
            if (!book) return null;
            const days = daysUntil(item.dueDate);

            return (
              <Link
                to={`/app/books/${book.id}`}
                key={item.id}
                className="surface-card flex gap-4 p-4 rounded-xl border border-border hover:border-primary transition group"
              >
                <div className="w-20 shrink-0">
                  <BookCover book={book} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition">
                    {book.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">by {book.author}</p>

                  <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                    <span>Issued: {formatDate(item.issueDate)}</span>
                    <span>Due: {formatDate(item.dueDate)}</span>
                  </div>

                  {/* Progress bar towards due date */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        days < 0 ? "bg-danger" : days <= 3 ? "bg-amber" : "bg-success"
                      }`}
                      style={{ width: `${Math.max(10, Math.min(100, ((14 - days) / 14) * 100))}%` }}
                    />
                  </div>

                  <p
                    className={`mt-2 text-xs font-semibold ${
                      days < 0 ? "text-danger" : days <= 3 ? "text-warning" : "text-success"
                    }`}
                  >
                    {days < 0
                      ? `Overdue by ${-days} day${days === -1 ? "" : "s"}`
                      : days === 0
                        ? "Due today!"
                        : `${days} day${days === 1 ? "" : "s"} remaining`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
