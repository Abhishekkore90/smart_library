import { useState } from "react";
import { Download, Printer, Search } from "lucide-react";
import { useAdminData, DataTable, field } from "@/components/admin/AdminData";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export function AdminReports() {
  const data = useAdminData();
  const [q, setQ] = useState("");

  const personName = (id: string) =>
    data.profiles.find((p) => p.id === id)?.name || "Unknown member";
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title || "Unknown title";

  const reportRows = data.loans.filter((l) =>
    `${personName(l.user_id)} ${bookName(l.book_id)}`.toLowerCase().includes(q.toLowerCase()),
  );

  const exportCsv = () => {
    const lines = [
      ["Member Name", "Book Title", "Issued Date", "Due Date", "Returned Date", "Status"],
      ...reportRows.map((l) => [
        personName(l.user_id),
        bookName(l.book_id),
        l.issue_date,
        l.due_date,
        l.returned_at || "",
        l.returned_at ? "Returned" : new Date(l.due_date) < new Date() ? "Overdue" : "Active",
      ]),
    ];

    const content = lines
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `smart-library-circulation-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Circulation Reports & Analytics"
        description="Comprehensive audit logs of library checkouts, returns, and fine reconciliation."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2">
              <Download className="size-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
              <Printer className="size-4" /> Print Report
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="surface-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Total Inventory</p>
          <strong className="text-2xl font-bold text-foreground mt-1 block">
            {data.books.length} titles
          </strong>
        </div>
        <div className="surface-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Total Issues</p>
          <strong className="text-2xl font-bold text-foreground mt-1 block">
            {data.loans.length}
          </strong>
        </div>
        <div className="surface-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Total Returns</p>
          <strong className="text-2xl font-bold text-foreground mt-1 block">
            {data.loans.filter((l) => l.returned_at).length}
          </strong>
        </div>
        <div className="surface-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Fines Collected</p>
          <strong className="text-2xl font-bold text-success mt-1 block">
            $
            {data.fines
              .filter((f) => f.status === "Paid")
              .reduce((a, f) => a + Number(f.amount || 0), 0)
              .toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter report records…"
          className={`${field} pl-10`}
        />
      </div>

      <DataTable
        headers={["Borrower", "Book Title", "Issued On", "Due Date", "Status"]}
        rows={reportRows.map((l) => [
          <strong>{personName(l.user_id)}</strong>,
          bookName(l.book_id),
          formatDate(l.issue_date),
          formatDate(l.due_date),
          l.returned_at ? (
            <span className="text-xs font-semibold text-success">
              Returned on {formatDate(l.returned_at)}
            </span>
          ) : new Date(l.due_date) < new Date() ? (
            <span className="text-xs font-semibold text-danger">Overdue</span>
          ) : (
            <span className="text-xs font-semibold text-primary">Currently Borrowed</span>
          ),
        ])}
      />
    </div>
  );
}
