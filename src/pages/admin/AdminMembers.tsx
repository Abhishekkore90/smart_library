import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminData, DataTable, field } from '@/components/admin/AdminData';
import { localBackend } from '@/lib/local-storage-backend';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export function AdminMembers() {
  const data = useAdminData();
  const [q, setQ] = useState('');

  const rows = data.profiles.filter((p) =>
    [p.name, p.email, p.department, p.student_id].some((k) =>
      String(k || '').toLowerCase().includes(q.toLowerCase())
    )
  );

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const res = localBackend.updateProfile(id, { status: nextStatus });
    if (res.ok) {
      toast.success(`Member status updated to ${nextStatus}`);
      void data.refresh();
    }
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Member Directory"
        description="Oversee student and faculty library accounts, borrowing privileges, and status."
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, ID, or department…"
          className={`${field} pl-10`}
        />
      </div>

      <DataTable
        headers={['Name', 'Student / Staff ID', 'Email Address', 'Department', 'Active Loans', 'Status', 'Action']}
        rows={rows.map((p) => {
          const activeLoanCount = data.loans.filter((l) => l.user_id === p.id && !l.returned_at).length;
          const isActive = p.status === 'active';

          return [
            <strong className="text-foreground">{p.name}</strong>,
            p.student_id,
            p.email,
            p.department || '—',
            `${activeLoanCount} book${activeLoanCount === 1 ? '' : 's'}`,
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isActive ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
              }`}
            >
              {p.status}
            </span>,
            <Button
              key={p.id}
              size="sm"
              variant="outline"
              onClick={() => toggleStatus(p.id, p.status)}
              className="text-xs h-8"
            >
              {isActive ? 'Suspend' : 'Activate'}
            </Button>,
          ];
        })}
      />
    </div>
  );
}
