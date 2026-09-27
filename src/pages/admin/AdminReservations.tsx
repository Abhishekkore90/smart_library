import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminData, DataTable, field } from '@/components/admin/AdminData';
import { localBackend } from '@/lib/local-storage-backend';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';

export function AdminReservations() {
  const data = useAdminData();
  const [q, setQ] = useState('');

  const personName = (id: string) => data.profiles.find((p) => p.id === id)?.name || 'Unknown member';
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title || 'Unknown title';

  const rows = data.reservations.filter((r) =>
    `${personName(r.user_id)} ${bookName(r.book_id)}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: any) => {
    localBackend.updateReservationStatus(id, newStatus);
    toast.success(`Reservation marked as ${newStatus}`);
    void data.refresh();
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Reservations & Hold Queue"
        description="Manage waiting readers through the hold lifecycle and notify them when copies are ready."
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by reader or book title…"
          className={`${field} pl-10`}
        />
      </div>

      <DataTable
        headers={['Member', 'Book Title', 'Hold Date', 'Status', 'Update Status']}
        rows={rows.map((r) => [
          <strong>{personName(r.user_id)}</strong>,
          bookName(r.book_id),
          formatDate(r.reserved_at),
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              r.status === 'Ready for Pickup'
                ? 'bg-success-soft text-success'
                : r.status === 'Cancelled'
                  ? 'bg-danger-soft text-danger'
                  : 'bg-amber-soft text-amber'
            }`}
          >
            {r.status}
          </span>,
          <select
            key={r.id}
            value={r.status}
            onChange={(e) => handleStatusChange(r.id, e.target.value)}
            className="h-8 rounded-md border border-input bg-card px-2 text-xs outline-none focus:border-primary"
          >
            {['Pending', 'Ready for Pickup', 'Completed', 'Cancelled'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>,
        ])}
      />
    </div>
  );
}
