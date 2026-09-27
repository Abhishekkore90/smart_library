import { useState } from 'react';
import { Search, Tags, Users } from 'lucide-react';
import { useAdminData, field } from '@/components/admin/AdminData';
import { PageHeader } from '@/components/shared/PageHeader';

export function AdminCategories({ mode = 'categories' }: { mode?: 'categories' | 'authors' }) {
  const data = useAdminData();
  const [q, setQ] = useState('');

  const key = mode === 'categories' ? 'category' : 'author';

  const counts = Object.entries(
    data.books.reduce((acc: Record<string, number>, b: any) => {
      const val = b[key] || 'Uncategorized';
      acc[val] = (acc[val] ?? 0) + 1;
      return acc;
    }, {})
  ).filter(([name]) => name.toLowerCase().includes(q.toLowerCase()));

  const Icon = mode === 'categories' ? Tags : Users;

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title={mode === 'categories' ? 'Subject Categories' : 'Catalog Authors'}
        description={
          mode === 'categories'
            ? 'Distribution of volumes across classified academic disciplines.'
            : 'Directory of all contributing book authors and publication volume.'
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${mode}…`}
          className={`${field} pl-10`}
        />
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {counts.map(([name, count]) => (
          <div
            key={name}
            className="surface-card flex items-center justify-between p-5 rounded-xl border border-border hover:border-primary transition"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <strong className="text-foreground text-sm font-semibold">{name}</strong>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
              {count} {count === 1 ? 'title' : 'titles'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
