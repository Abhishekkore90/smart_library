import { Heart } from 'lucide-react';
import { useLibrary } from '@/lib/library-store';
import { BookCard } from '@/components/books/BookCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

export function Favourites() {
  const { books, favourites } = useLibrary();

  const favBooks = books.filter((b) => favourites.includes(b.id));

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Saved Books & Favourites"
        description="Your curated wishlist and titles saved for later study."
      />

      {favBooks.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourite books saved yet"
          description="Click the heart icon on any book cover in the catalog to pin it here."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {favBooks.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
