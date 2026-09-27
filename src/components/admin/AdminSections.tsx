import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  BookOpen,
  Users,
  BookOpenCheck,
  CircleAlert,
  Bookmark,
  BadgeDollarSign,
  Search,
  Plus,
  Download,
  Printer,
  Pencil,
  Trash2,
  Bell,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
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
import { localBackend } from '@/lib/local-storage-backend';
import { useLibrary } from '@/lib/library-store';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { useAdminData, DataTable, field } from './AdminData';

const chartColors = ['var(--primary)', 'var(--amber)', 'var(--success)', 'var(--danger)', 'var(--navy)'];
const bookFields = [
  'title',
  'author',
  'isbn',
  'publisher',
  'year',
  'category',
  'language',
  'description',
  'total_copies',
  'available_copies',
  'shelf',
  'cover_url',
] as const;

const bookDefaults = {
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  year: '2025',
  category: 'General',
  language: 'English',
  description: '',
  total_copies: '1',
  available_copies: '1',
  shelf: '',
  cover_url: '',
};

export function AdminSection({ section }: { section: string }) {
  const data = useAdminData();
  const { refresh: refreshMember } = useLibrary();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [form, setForm] = useState(bookDefaults);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [person, setPerson] = useState('');
  const [book, setBook] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [announcement, setAnnouncement] = useState('');

  const personName = (id: string) => data.profiles.find((p) => p.id === id)?.name ?? 'Unknown member';
  const bookName = (id: string) => data.books.find((b) => b.id === id)?.title ?? 'Unknown book';
  const search = (rows: any[], keys: string[]) =>
    rows.filter((r) => keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase())));
  const paginate = (rows: any[]) => rows.slice(page * 10, (page + 1) * 10);
  const pager = (total: number) =>
    total > 10 ? (
      <div className="flex items-center justify-end gap-3 text-sm">
        <Button variant="outline" disabled={!page} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        Page {page + 1} of {Math.ceil(total / 10)}
        <Button variant="outline" disabled={(page + 1) * 10 >= total} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    ) : null;

  const input = (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(0);
        }}
        className={`${field} pl-10`}
        placeholder="Search records…"
      />
    </div>
  );

  const action = async (operation: () => Promise<any> | any, message: string) => {
    setBusy(true);
    try {
      const result = await operation();
      if (result?.error) throw result.error;
      toast.success(message);
      await Promise.all([data.refresh(), refreshMember()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  if (data.loading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 w-64 rounded-md bg-secondary" />
        <div className="h-72 rounded-md bg-secondary" />
      </div>
    );

  if (section === 'dashboard') {
    const active = data.loans.filter((l) => !l.returned_at);
    const overdue = active.filter((l) => new Date(l.due_date) < new Date());
    const catCount = Object.entries(
      data.books.reduce((a: Record<string, number>, b: any) => {
        a[b.category] = (a[b.category] ?? 0) + 1;
        return a;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    const circulation = Array.from({ length: 6 }, (_, i) => {
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

    return (
      <>
        <PageHeader title="Library overview" description="A clear picture of your library, right now." />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard label="Total books" value={data.books.reduce((a, b) => a + Number(b.total_copies || 0), 0)} icon={BookOpen} />
          <StatCard label="Members" value={data.profiles.length} icon={Users} tone="navy" />
          <StatCard label="Issued books" value={active.length} icon={BookOpenCheck} tone="success" />
          <StatCard label="Available" value={data.books.reduce((a, b) => a + Number(b.available_copies || 0), 0)} icon={BookOpen} tone="amber" />
          <StatCard label="Overdue" value={overdue.length} icon={CircleAlert} tone="danger" />
          <StatCard label="Reservations" value={data.reservations.filter((r) => r.status === 'Pending').length} icon={Bookmark} />
          <StatCard
            label="Outstanding fines"
            value={data.fines
              .filter((f) => f.status === 'Pending')
              .reduce((a, f) => a + Number(f.amount), 0)
              .toFixed(2)}
            icon={BadgeDollarSign}
            tone="amber"
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="font-bold">Monthly circulation</h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={circulation}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line dataKey="issued" stroke="var(--primary)" strokeWidth={3} />
                  <Line dataKey="returned" stroke="var(--success)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-bold">Books overview</h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Available', value: data.books.reduce((a, b) => a + Number(b.available_copies || 0), 0) },
                    { name: 'Issued', value: active.length },
                    { name: 'Returned', value: data.loans.filter((l) => l.returned_at).length },
                    { name: 'Overdue', value: overdue.length },
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
          <div className="surface-card p-6">
            <h2 className="font-bold">Popular categories</h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={catCount} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} label>
                    {catCount.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-bold">Recent activity</h2>
            <div className="mt-5 space-y-4">
              {data.loans.slice(0, 5).map((l) => (
                <div key={l.id} className="flex gap-3 border-b border-border pb-3 text-sm">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <strong>{l.returned_at ? 'Book returned' : 'Book issued'}</strong>
                    <p className="text-muted-foreground">
                      {bookName(l.book_id)} · {personName(l.user_id)}
                    </p>
                  </div>
                </div>
              ))}
              {data.loans.length === 0 && (
                <p className="text-sm text-muted-foreground">Activity will appear as books circulate.</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (section === 'books') {
    const rows = search(data.books, ['title', 'author', 'isbn', 'category']);
    return (
      <>
        <PageHeader
          title="Book collection"
          description="Manage every title and copy in your catalog."
          actions={
            <Button asChild>
              <Link to="/admin/add-book">
                <Plus /> Add book
              </Link>
            </Button>
          }
        />
        {input}
        <DataTable
          headers={['Title', 'Author', 'Category', 'ISBN', 'Copies', 'Actions']}
          rows={paginate(rows).map((b) => [
            <strong>{b.title}</strong>,
            b.author,
            b.category,
            b.isbn,
            `${b.available_copies} / ${b.total_copies}`,
            <div className="flex gap-2" key={b.id}>
              <Button
                size="icon"
                variant="outline"
                title="Edit book"
                onClick={() => navigate({ to: '/admin/add-book', search: { edit: b.id } })}
              >
                <Pencil />
              </Button>
              <Button
                size="icon"
                variant="outline"
                title="Delete book"
                onClick={() => {
                  if (window.confirm(`Delete ${b.title}?`)) {
                    void action(() => localBackend.deleteBook(b.id), 'Book deleted');
                  }
                }}
              >
                <Trash2 />
              </Button>
            </div>,
          ])}
        />
        {pager(rows.length)}
      </>
    );
  }

  if (section === 'add-book') {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const editId = params.get('edit');
    const existing = data.books.find((b) => b.id === editId);
    const current =
      editing === editId
        ? form
        : existing
          ? (Object.fromEntries(bookFields.map((k) => [k, String(existing[k] ?? '')])) as typeof form)
          : form;

    async function save(e: FormEvent) {
      e.preventDefault();
      if (Number(current.available_copies) > Number(current.total_copies)) {
        toast.error('Available copies cannot exceed total copies');
        return;
      }
      const payload = {
        ...current,
        year: Number(current.year),
        total_copies: Number(current.total_copies),
        available_copies: Number(current.available_copies),
        cover_url: current.cover_url || null,
      };
      await action(
        () => (editId ? localBackend.updateBook(editId, payload) : localBackend.addBook(payload)),
        editId ? 'Book updated' : 'Book added'
      );
      navigate({ to: '/admin/books' });
    }

    return (
      <>
        <PageHeader
          title={editId ? 'Edit book' : 'Add a book'}
          description="Keep catalog information accurate and easy to discover."
        />
        <form onSubmit={save} className="surface-card grid gap-5 p-6 sm:grid-cols-2">
          {bookFields.map((k) => (
            <label key={k} className={`text-sm font-semibold capitalize ${k === 'description' ? 'sm:col-span-2' : ''}`}>
              {k.replaceAll('_', ' ')}
              {k === 'description' ? (
                <textarea
                  maxLength={3000}
                  value={current[k]}
                  onChange={(e) => {
                    setEditing(editId);
                    setForm({ ...current, [k]: e.target.value });
                  }}
                  className={`${field} mt-2 min-h-24 py-2`}
                />
              ) : (
                <input
                  required={!['cover_url', 'shelf'].includes(k)}
                  maxLength={255}
                  min={['year', 'total_copies', 'available_copies'].includes(k) ? 0 : undefined}
                  type={['year', 'total_copies', 'available_copies'].includes(k) ? 'number' : 'text'}
                  value={current[k]}
                  onChange={(e) => {
                    setEditing(editId);
                    setForm({ ...current, [k]: e.target.value });
                  }}
                  className={`${field} mt-2`}
                />
              )}
            </label>
          ))}
          <div className="sm:col-span-2">
            <Button disabled={busy}>{busy ? 'Saving…' : editId ? 'Save changes' : 'Add to collection'}</Button>
          </div>
        </form>
      </>
    );
  }

  if (section === 'categories' || section === 'authors') {
    const key = section === 'categories' ? 'category' : 'author';
    const counts = Object.entries(
      data.books.reduce((acc: Record<string, number>, b: any) => {
        acc[b[key]] = (acc[b[key]] ?? 0) + 1;
        return acc;
      }, {})
    );
    return (
      <>
        <PageHeader
          title={section === 'categories' ? 'Categories' : 'Authors'}
          description="Explore the people and subjects behind the catalog."
        />
        {input}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {counts
            .filter(([name]) => name.toLowerCase().includes(q.toLowerCase()))
            .map(([name, count]) => (
              <div key={name} className="surface-card flex items-center justify-between p-5">
                <strong>{name}</strong>
                <span className="text-sm text-muted-foreground">{count} titles</span>
              </div>
            ))}
        </div>
      </>
    );
  }

  if (section === 'users') {
    const rows = search(data.profiles, ['name', 'email', 'department', 'student_id']);
    return (
      <>
        <PageHeader title="Members" description="Manage library accounts and membership status." />
        {input}
        <DataTable
          headers={['Name', 'ID', 'Email', 'Department', 'Issued', 'Status', 'Actions']}
          rows={paginate(rows).map((p) => [
            <strong>{p.name}</strong>,
            p.student_id,
            p.email,
            p.department || '—',
            data.loans.filter((l) => l.user_id === p.id && !l.returned_at).length,
            p.status,
            <Button
              key={p.id}
              size="sm"
              variant="outline"
              onClick={() =>
                void action(
                  () =>
                    localBackend.updateProfile(p.id, {
                      status: p.status === 'active' ? 'suspended' : 'active',
                    }),
                  p.status === 'active' ? 'Member suspended' : 'Member activated'
                )
              }
            >
              {p.status === 'active' ? 'Suspend' : 'Activate'}
            </Button>,
          ])}
        />
        {pager(rows.length)}
      </>
    );
  }

  if (section === 'issues') {
    const rows = data.loans.filter(
      (l) => !l.returned_at && `${personName(l.user_id)} ${bookName(l.book_id)}`.toLowerCase().includes(q.toLowerCase())
    );
    return (
      <>
        <PageHeader title="Issue management" description="Check out books and monitor active loans." />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void action(() => {
              const res = localBackend.issueBook(book, person);
              if (!res.ok) throw new Error(res.message);
            }, 'Book issued');
          }}
          className="surface-card grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto]"
        >
          <select required value={person} onChange={(e) => setPerson(e.target.value)} className={field}>
            <option value="">Select member</option>
            {data.profiles
              .filter((p) => p.status === 'active')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.student_id})
                </option>
              ))}
          </select>
          <select required value={book} onChange={(e) => setBook(e.target.value)} className={field}>
            <option value="">Select book</option>
            {data.books
              .filter((b) => b.available_copies > 0)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.available_copies} left)
                </option>
              ))}
          </select>
          <Button disabled={busy}>
            <Plus /> Issue book
          </Button>
        </form>
        {input}
        <DataTable
          headers={['Member', 'Book', 'Issue date', 'Due date', 'Status']}
          rows={paginate(rows).map((l) => [
            personName(l.user_id),
            bookName(l.book_id),
            formatDate(l.issue_date),
            formatDate(l.due_date),
            new Date(l.due_date) < new Date() ? 'Overdue' : 'Active',
          ])}
        />
        {pager(rows.length)}
      </>
    );
  }

  if (section === 'returns') {
    const rows = data.loans.filter((l) =>
      `${personName(l.user_id)} ${bookName(l.book_id)}`.toLowerCase().includes(q.toLowerCase())
    );
    return (
      <>
        <PageHeader
          title="Return management"
          description="Record returns and calculate overdue fines automatically."
        />
        {input}
        <DataTable
          headers={['Member', 'Book', 'Issued', 'Due', 'Returned', 'Action']}
          rows={paginate(rows).map((l) => [
            personName(l.user_id),
            bookName(l.book_id),
            formatDate(l.issue_date),
            formatDate(l.due_date),
            l.returned_at ? formatDate(l.returned_at) : 'Outstanding',
            l.returned_at ? (
              'Returned'
            ) : (
              <Button
                key={l.id}
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  if (window.confirm('Mark this book as returned?')) {
                    void action(() => {
                      const res = localBackend.returnBook(l.id);
                      if (!res.ok) throw new Error(res.message);
                    }, 'Book returned and fine calculated');
                  }
                }}
              >
                <RotateCcw /> Return
              </Button>
            ),
          ])}
        />
        {pager(rows.length)}
      </>
    );
  }

  if (section === 'reservations') {
    const rows = data.reservations.filter((r) =>
      `${personName(r.user_id)} ${bookName(r.book_id)}`.toLowerCase().includes(q.toLowerCase())
    );
    return (
      <>
        <PageHeader title="Reservations" description="Move waiting readers through the pickup queue." />
        {input}
        <DataTable
          headers={['Member', 'Book', 'Reserved', 'Status', 'Update']}
          rows={paginate(rows).map((r) => [
            personName(r.user_id),
            bookName(r.book_id),
            formatDate(r.reserved_at),
            r.status,
            <select
              key={r.id}
              value={r.status}
              className={field}
              onChange={(e) =>
                void action(
                  () => localBackend.updateReservationStatus(r.id, e.target.value as any),
                  'Reservation updated'
                )
              }
            >
              {['Pending', 'Ready for Pickup', 'Completed', 'Cancelled'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>,
          ])}
        />
        {pager(rows.length)}
      </>
    );
  }

  if (section === 'fines') {
    const rows = data.fines.filter((f) =>
      `${personName(f.user_id)} ${bookName(data.loans.find((l) => l.id === f.loan_id)?.book_id)}`
        .toLowerCase()
        .includes(q.toLowerCase())
    );
    return (
      <>
        <PageHeader title="Fines" description="Track outstanding charges and collection status." />
        {input}
        <DataTable
          headers={['Member', 'Book', 'Amount', 'Status', 'Update']}
          rows={paginate(rows).map((f) => [
            personName(f.user_id),
            bookName(data.loans.find((l) => l.id === f.loan_id)?.book_id),
            Number(f.amount).toFixed(2),
            f.status,
            <select
              key={f.id}
              value={f.status}
              className={field}
              onChange={(e) =>
                void action(() => localBackend.updateFineStatus(f.id, e.target.value as any), 'Fine updated')
              }
            >
              {['Pending', 'Paid', 'Waived'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>,
          ])}
        />
        {pager(rows.length)}
      </>
    );
  }

  if (section === 'reports') {
    const reportRows = data.loans.filter((l) =>
      `${personName(l.user_id)} ${bookName(l.book_id)}`.toLowerCase().includes(q.toLowerCase())
    );
    function csv() {
      const lines = [
        ['Member', 'Book', 'Issued', 'Due', 'Returned', 'Status'],
        ...reportRows.map((l) => [
          personName(l.user_id),
          bookName(l.book_id),
          l.issue_date,
          l.due_date,
          l.returned_at ?? '',
          l.returned_at ? 'Returned' : new Date(l.due_date) < new Date() ? 'Overdue' : 'Active',
        ]),
      ];
      const content = lines.map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
      const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'smart-library-report.csv';
      anchor.click();
      URL.revokeObjectURL(url);
    }
    return (
      <>
        <PageHeader
          title="Reports"
          description="Understand circulation and export your records."
          actions={
            <>
              <Button variant="outline" onClick={csv}>
                <Download /> Export CSV
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer /> Print / PDF
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Inventory', data.books.length],
            ['Issues', data.loans.length],
            ['Returns', data.loans.filter((l) => l.returned_at).length],
            [
              'Fine collection',
              data.fines
                .filter((f) => f.status === 'Paid')
                .reduce((a, f) => a + Number(f.amount), 0)
                .toFixed(2),
            ],
          ].map(([k, v]) => (
            <div className="surface-card p-5" key={k}>
              <p className="text-xs text-muted-foreground">{k}</p>
              <strong className="text-2xl">{v}</strong>
            </div>
          ))}
        </div>
        {input}
        <DataTable
          headers={['Member', 'Book', 'Issued', 'Due', 'Status']}
          rows={paginate(reportRows).map((l) => [
            personName(l.user_id),
            bookName(l.book_id),
            formatDate(l.issue_date),
            formatDate(l.due_date),
            l.returned_at ? 'Returned' : new Date(l.due_date) < new Date() ? 'Overdue' : 'Active',
          ])}
        />
        {pager(reportRows.length)}
      </>
    );
  }

  if (section === 'settings') {
    const values = settings ?? data.settings;
    return (
      <>
        <PageHeader
          title="Library settings"
          description="The policies and details that shape your library."
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void action(() => localBackend.updateSettings(values), 'Settings saved');
          }}
          className="surface-card grid gap-5 p-6 sm:grid-cols-2"
        >
          {([
            'name',
            'address',
            'contact',
            'hours',
            'max_books',
            'loan_days',
            'fine_per_day',
            'reservation_limit',
          ] as const).map((k) => (
            <label key={k} className="text-sm font-semibold capitalize">
              {k.replaceAll('_', ' ')}
              <input
                required
                value={values?.[k] ?? ''}
                type={['max_books', 'loan_days', 'fine_per_day', 'reservation_limit'].includes(k) ? 'number' : 'text'}
                min={0}
                maxLength={255}
                onChange={(e) =>
                  setSettings({
                    ...values,
                    [k]: ['max_books', 'loan_days', 'fine_per_day', 'reservation_limit'].includes(k)
                      ? Number(e.target.value)
                      : e.target.value,
                  })
                }
                className={`${field} mt-2`}
              />
            </label>
          ))}
          <div className="sm:col-span-2">
            <Button disabled={busy}>Save settings</Button>
          </div>
        </form>
      </>
    );
  }

  if (section === 'notifications')
    return (
      <>
        <PageHeader title="Announcements" description="Share updates with your library members." />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void action(async () => {
              data.profiles.forEach((p) => {
                localBackend.addNotification({
                  user_id: p.id,
                  title: 'Library announcement',
                  body: announcement,
                  kind: 'announcement',
                });
              });
            }, 'Announcement sent');
            setAnnouncement('');
          }}
          className="surface-card space-y-4 p-6"
        >
          <textarea
            required
            maxLength={1000}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write an announcement for all members…"
            className={`${field} min-h-28 py-3`}
          />
          <Button disabled={busy || !data.profiles.length}>
            <Bell /> Send announcement
          </Button>
        </form>
        <DataTable
          headers={['Message', 'Date']}
          rows={data.notifications
            .filter((n) => n.kind === 'announcement')
            .slice(0, 10)
            .map((n) => [n.body, formatDate(n.created_at)])}
        />
      </>
    );

  return null;
}
