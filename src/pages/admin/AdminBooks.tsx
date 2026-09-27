import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminData, DataTable, field } from '@/components/admin/AdminData';
import { localBackend } from '@/lib/local-storage-backend';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export function AdminBooks() {
  const data = useAdminData();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const filtered = data.books.filter((b) =>
    [b.title, b.author, b.isbn, b.category].some((k) =>
      String(k || '').toLowerCase().includes(q.toLowerCase())
    )
  );

  const paged = filtered.slice(page * 10, (page + 1) * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" from the catalog?`)) {
      const res = localBackend.deleteBook(id);
      if (res.ok) {
        toast.success('Book removed from library catalog');
        void data.refresh();
      }
    }
  };

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Book Inventory"
        description="Add, edit, inspect stock, and manage every title in your collection."
        actions={
          <Button asChild className="gap-2">
            <Link to="/admin/add-book">
              <Plus className="size-4" /> Add New Book
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          className={`${field} pl-10`}
          placeholder="Search by title, author, ISBN…"
        />
      </div>

      <DataTable
        headers={['Title', 'Author', 'Category', 'ISBN', 'Copies Available', 'Shelf', 'Actions']}
        rows={paged.map((b) => [
          <strong className="text-foreground">{b.title}</strong>,
          b.author,
          <span className="px-2 py-0.5 rounded-md bg-indigo-soft text-indigo text-xs font-semibold">{b.category}</span>,
          b.isbn,
          `${b.available_copies} / ${b.total_copies}`,
          b.shelf,
          <div className="flex gap-2" key={b.id}>
            <Button
              size="icon"
              variant="outline"
              title="Edit book"
              className="size-8"
              onClick={() => navigate(`/admin/add-book?edit=${b.id}`)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              title="Delete book"
              className="size-8 text-danger border-danger/30 hover:bg-danger/10"
              onClick={() => handleDelete(b.id, b.title)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>,
        ])}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm pt-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
