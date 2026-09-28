import { useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { useAdminData, DataTable, field } from "@/components/admin/AdminData";
import { localBackend } from "@/lib/local-storage-backend";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export function AdminReturns() {
  const data = useAdminData();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const personName = (id: string) =>
    data.profiles.find((p) => p.id === id)?.name || "Unknown member";
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title || "Unknown title";

  const rows = data.loans.filter((l) =>
    `${personName(l.user_id)} ${bookName(l.book_id)}`.toLowerCase().includes(q.toLowerCase()),
  );

  const handleReturn = (loanId: string) => {
    if (
      window.confirm(
        "Mark this loan as returned? Copies will be restored and overdue fines calculated if late.",
      )
    ) {
      setBusy(true);
      const res = localBackend.returnBook(loanId);
      if (res.ok) {
        if (res.fineAmount && res.fineAmount > 0) {
          toast.warning(
            `Book returned. An overdue late fee of $${res.fineAmount.toFixed(2)} was calculated.`,
          );
        } else {
          toast.success("Book returned on time. Stock updated!");
        }
        void data.refresh();
      } else {
        toast.error(res.message);
      }
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Return & Check-in Management"
        description="Process returned books, increment shelf counts, and automatically record late return fines."
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by member or title…"
          className={`${field} pl-10`}
        />
      </div>

      <DataTable
        headers={["Member", "Book Title", "Date Issued", "Due Date", "Return Date", "Action"]}
        rows={rows.map((l) => [
          <strong>{personName(l.user_id)}</strong>,
          bookName(l.book_id),
          formatDate(l.issue_date),
          formatDate(l.due_date),
          l.returned_at ? (
            <span className="text-xs text-muted-foreground">{formatDate(l.returned_at)}</span>
          ) : (
            <span className="text-xs font-semibold text-amber">Currently Outstanding</span>
          ),
          l.returned_at ? (
            <span className="px-2.5 py-1 rounded-full bg-success-soft text-success text-xs font-semibold">
              Returned
            </span>
          ) : (
            <Button
              key={l.id}
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => handleReturn(l.id)}
              className="gap-1.5 text-xs h-8"
            >
              <RotateCcw className="size-3.5" /> Process Return
            </Button>
          ),
        ])}
      />
    </div>
  );
}
