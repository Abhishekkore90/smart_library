import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminData, DataTable, field } from '@/components/admin/AdminData';
import { localBackend } from '@/lib/local-storage-backend';
import { PageHeader } from '@/components/shared/PageHeader';

export function AdminFines() {
  const data = useAdminData();
  const [q, setQ] = useState('');

  const personName = (id: string) => data.profiles.find((p) => p.id === id)?.name || 'Unknown member';
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title || 'Unknown book';

  const rows = data.fines.filter((f) => {
    const loan = data.loans.find((l) => l.id === f.loan_id);
    return `${personName(f.user_id)} ${bookName(loan?.book_id)}`.toLowerCase().includes(q.toLowerCase());
  });

  const totalOutstanding = data.fines
    .filter((f) => f.status === 'Pending')
    .reduce((acc, f) => acc + Number(f.amount || 0), 0);

  const totalPaid = data.fines
    .filter((f) => f.status === 'Paid')
    .reduce((acc, f) => acc + Number(f.amount || 0), 0);

  const handleFineUpdate = (fineId: string, status: any) => {
    localBackend.updateFineStatus(fineId, status);
    toast.success(`Fine status updated to ${status}`);
    void data.refresh();
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Overdue Fines & Fees"
        description="Track accumulated late return fees, mark payments collected, or apply administrative waivers."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-xl">
        <div className="surface-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Total Outstanding</p>
          <strong className="text-2xl font-bold text-danger mt-1 block">${totalOutstanding.toFixed(2)}</strong>
        </div>
        <div className="surface-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Total Collected</p>
          <strong className="text-2xl font-bold text-success mt-1 block">${totalPaid.toFixed(2)}</strong>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by member name…"
          className={`${field} pl-10`}
        />
      </div>

      <DataTable
        headers={['Member', 'Associated Book', 'Fine Amount', 'Payment Status', 'Update Action']}
        rows={rows.map((f) => {
          const loan = data.loans.find((l) => l.id === f.loan_id);
          return [
            <strong>{personName(f.user_id)}</strong>,
            bookName(loan?.book_id),
            `$${Number(f.amount).toFixed(2)}`,
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                f.status === 'Paid'
                  ? 'bg-success-soft text-success'
                  : f.status === 'Waived'
                    ? 'bg-secondary text-muted-foreground'
                    : 'bg-danger-soft text-danger'
              }`}
            >
              {f.status}
            </span>,
            <select
              key={f.id}
              value={f.status}
              onChange={(e) => handleFineUpdate(f.id, e.target.value)}
              className="h-8 rounded-md border border-input bg-card px-2 text-xs outline-none focus:border-primary"
            >
              {['Pending', 'Paid', 'Waived'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>,
          ];
        })}
      />
    </div>
  );
}
