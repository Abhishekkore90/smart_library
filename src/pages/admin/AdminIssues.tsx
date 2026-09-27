import { useState, type FormEvent } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminData, DataTable, field } from '@/components/admin/AdminData';
import { localBackend } from '@/lib/local-storage-backend';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export function AdminIssues() {
  const data = useAdminData();
  const [person, setPerson] = useState('');
  const [book, setBook] = useState('');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);

  const personName = (id: string) => data.profiles.find((p) => p.id === id)?.name || 'Unknown member';
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title || 'Unknown title';

  const activeLoans = data.loans.filter(
    (l) =>
      !l.returned_at &&
      `${personName(l.user_id)} ${bookName(l.book_id)}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleIssue = (e: FormEvent) => {
    e.preventDefault();
    if (!book || !person) return;
    setBusy(true);

    const res = localBackend.issueBook(book, person);
    if (!res.ok) {
      toast.error(res.message);
    } else {
      toast.success('Book successfully issued to member');
      setBook('');
      setPerson('');
      void data.refresh();
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Book Issue & Checkout"
        description="Check out books directly to verified active library members."
      />

      {/* Issue Form Card */}
      <form
        onSubmit={handleIssue}
        className="surface-card p-5 rounded-xl border border-border grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Library Member</label>
          <select
            required
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className={field}
          >
            <option value="">Choose active member…</option>
            {data.profiles
              .filter((p) => p.status === 'active')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.student_id}) — {p.department}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Title from Catalog</label>
          <select
            required
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className={field}
          >
            <option value="">Choose available book…</option>
            {data.books
              .filter((b) => b.available_copies > 0)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.available_copies} available)
                </option>
              ))}
          </select>
        </div>

        <Button disabled={busy} className="gap-2 h-10">
          <Plus className="size-4" /> Issue Book
        </Button>
      </form>

      {/* Active Loans Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-bold text-base text-foreground">Active Outstanding Loans</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search active loans…"
              className={`${field} h-9 pl-9 text-xs`}
            />
          </div>
        </div>

        <DataTable
          headers={['Borrower', 'Book Title', 'Date Issued', 'Due Date', 'Status']}
          rows={activeLoans.map((l) => [
            <strong>{personName(l.user_id)}</strong>,
            bookName(l.book_id),
            formatDate(l.issue_date),
            formatDate(l.due_date),
            new Date(l.due_date) < new Date() ? (
              <span className="px-2 py-0.5 rounded-full bg-danger-soft text-danger text-xs font-semibold">
                Overdue
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-success-soft text-success text-xs font-semibold">
                Active Loan
              </span>
            ),
          ])}
        />
      </div>
    </div>
  );
}
