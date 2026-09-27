import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, BookOpenCheck, BookmarkPlus, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useLibrary } from '@/lib/library-store';
import { BookCover } from '@/components/books/BookCover';
import { AvailabilityPill } from '@/components/books/AvailabilityPill';
import { Button } from '@/components/ui/button';

export function BookDetails() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBook, issueBook, reserveBook, toggleFavourite, favourites, loading } = useLibrary();

  const book = bookId ? getBook(bookId) : undefined;

  if (!book) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{loading ? 'Loading book details…' : 'Book not found in catalog.'}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/app/browse">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  const isFav = favourites.includes(book.id);

  return (
    <div className="space-y-6 animate-rise-in max-w-5xl">
      <Link
        to="/app/browse"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="size-4" /> Back to Catalog
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(240px,320px)_1fr] items-start">
        {/* Book Jacket Graphic */}
        <div className="max-w-xs mx-auto md:mx-0 w-full">
          <BookCover book={book} className="shadow-xl" />
        </div>

        {/* Details Information */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="rounded-md bg-indigo-soft px-3 py-1 text-xs font-semibold text-indigo">
                {book.category}
              </span>
              <AvailabilityPill available={book.availableCopies} />
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl text-foreground">{book.title}</h1>
            <p className="mt-1.5 text-lg text-muted-foreground">by {book.author}</p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Star className="size-4 fill-amber text-amber" />
            <strong className="text-foreground">{book.rating}</strong>
            <span className="text-muted-foreground">reader rating</span>
          </div>

          <p className="leading-relaxed text-muted-foreground text-sm sm:text-base">{book.description}</p>

          {/* Book Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 text-sm sm:grid-cols-3">
            {[
              ['ISBN', book.isbn],
              ['Publisher', book.publisher],
              ['Publication Year', book.year],
              ['Language', book.language],
              ['Shelf Location', book.shelf],
              ['Stock Copies', `${book.availableCopies} of ${book.totalCopies} available`],
            ].map(([k, v]) => (
              <div key={k as string}>
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="mt-0.5 font-semibold text-foreground">{v}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={book.availableCopies === 0}
              onClick={async () => {
                const result = await issueBook(book.id);
                toast[result.ok ? 'success' : 'error'](result.message);
              }}
              className="gap-2"
            >
              <BookOpenCheck className="size-4" /> Issue Book
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                const result = await reserveBook(book.id);
                toast[result.ok ? 'success' : 'error'](result.message);
              }}
              className="gap-2"
            >
              <BookmarkPlus className="size-4" /> Reserve Copy
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                void toggleFavourite(book.id)
                  .then((added) => toast.success(added ? 'Saved to favourites' : 'Removed from favourites'))
                  .catch((e) => toast.error(e.message));
              }}
              className="gap-2"
            >
              <Heart className={`size-4 ${isFav ? 'fill-danger text-danger' : ''}`} />
              {isFav ? 'Saved' : 'Favourite'}
            </Button>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-4 text-primary" /> Locate physical book at aisle/shelf:{' '}
            <strong className="text-foreground">{book.shelf}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
