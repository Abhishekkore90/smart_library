import { BookOpen, Users, BookOpenCheck, CircleAlert, Bookmark, BadgeDollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useAdminData } from '@/components/admin/AdminData';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';

const chartColors = ['var(--primary)', 'var(--amber)', 'var(--success)', 'var(--danger)', 'var(--navy)'];

export function AdminDashboard() {
  const data = useAdminData();

  if (data.loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 w-64 rounded-md bg-secondary" />
        <div className="h-72 rounded-md bg-secondary" />
      </div>
    );
  }

  const activeLoans = data.loans.filter((l) => !l.returned_at);
  const overdueLoans = activeLoans.filter((l) => new Date(l.due_date) < new Date());

  const categoryCounts = Object.entries(
    data.books.reduce((acc: Record<string, number>, b: any) => {
      acc[b.category] = (acc[b.category] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const circulationData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5 + i);
    return {
      month: d.toLocaleString('en', { month: 'short' }),
      issued: data.loans.filter(
        (l) =>
          new Date(l.issue_date).getMonth() === d.getMonth() &&
          new Date(l.issue_date).getFullYear() === d.getFullYear()
      ).length,
      returned: data.loans.filter(
        (l) =>
          l.returned_at &&
          new Date(l.returned_at).getMonth() === d.getMonth() &&
          new Date(l.returned_at).getFullYear() === d.getFullYear()
      ).length,
    };
  });

  const personName = (id: string) => data.profiles.find((p) => p.id === id)?.name || 'Unknown member';
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title || 'Unknown title';

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Circulation Overview"
        description="Real-time analytics on books, borrowers, active loans, and collections."
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Books"
          value={data.books.reduce((acc, b) => acc + Number(b.total_copies || 0), 0)}
          icon={BookOpen}
        />
        <StatCard label="Registered Members" value={data.profiles.length} icon={Users} tone="navy" />
        <StatCard label="Currently Issued" value={activeLoans.length} icon={BookOpenCheck} tone="success" />
        <StatCard
          label="Available on Shelves"
          value={data.books.reduce((acc, b) => acc + Number(b.available_copies || 0), 0)}
          icon={BookOpen}
          tone="amber"
        />
        <StatCard label="Overdue Loans" value={overdueLoans.length} icon={CircleAlert} tone="danger" />
        <StatCard
          label="Pending Holds"
          value={data.reservations.filter((r) => r.status === 'Pending').length}
          icon={Bookmark}
        />
        <StatCard
          label="Unpaid Fines"
          value={`$${data.fines
            .filter((f) => f.status === 'Pending')
            .reduce((acc, f) => acc + Number(f.amount || 0), 0)
            .toFixed(2)}`}
          icon={BadgeDollarSign}
          tone="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Circulation Trends */}
        <div className="surface-card p-6 rounded-xl border border-border">
          <h2 className="font-bold text-base text-foreground mb-1">Circulation Trends</h2>
          <p className="text-xs text-muted-foreground mb-4">Monthly issues vs returns</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={circulationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="issued" name="Issued" stroke="var(--primary)" strokeWidth={3} />
                <Line type="monotone" dataKey="returned" name="Returned" stroke="var(--success)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Breakdown */}
        <div className="surface-card p-6 rounded-xl border border-border">
          <h2 className="font-bold text-base text-foreground mb-1">Catalog Status Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Current availability metrics</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Available',
                    value: data.books.reduce((acc, b) => acc + Number(b.available_copies || 0), 0),
                  },
                  { name: 'Issued', value: activeLoans.length },
                  { name: 'Returned', value: data.loans.filter((l) => l.returned_at).length },
                  { name: 'Overdue', value: overdueLoans.length },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="surface-card p-6 rounded-xl border border-border">
          <h2 className="font-bold text-base text-foreground mb-1">Popular Subject Categories</h2>
          <p className="text-xs text-muted-foreground mb-4">Volumes by academic discipline</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryCounts} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} label>
                  {categoryCounts.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Circulation Activity */}
        <div className="surface-card p-6 rounded-xl border border-border">
          <h2 className="font-bold text-base text-foreground mb-1">Recent Activity Log</h2>
          <p className="text-xs text-muted-foreground mb-4">Latest issue and return transactions</p>
          <div className="space-y-3">
            {data.loans.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center gap-3 border-b border-border pb-3 text-sm">
                <span
                  className={`size-2.5 rounded-full shrink-0 ${l.returned_at ? 'bg-success' : 'bg-primary'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {l.returned_at ? 'Book Returned' : 'Book Issued'}: {bookName(l.book_id)}
                  </p>
                  <p className="text-xs text-muted-foreground">Borrower: {personName(l.user_id)}</p>
                </div>
              </div>
            ))}
            {data.loans.length === 0 && (
              <p className="text-sm text-muted-foreground">No loans recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
