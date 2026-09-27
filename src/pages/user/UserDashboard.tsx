import { Link } from 'react-router-dom';
import { BookOpenCheck, CalendarClock, Bookmark, History, ArrowRight, Search, Sparkles } from 'lucide-react';
import { useLibrary } from '@/lib/library-store';
import { greeting, daysUntil } from '@/lib/utils';
import { StatCard } from '@/components/shared/StatCard';
import { BookCard } from '@/components/books/BookCard';
import { Button } from '@/components/ui/button';

export function UserDashboard() {
  const { user, books, issued, reservations, history } = useLibrary();

  const dueSoonCount = issued.filter((i) => daysUntil(i.dueDate) <= 7).length;
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-8 animate-rise-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-navy px-7 py-9 text-navy-foreground sm:px-10 sm:py-11 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber">
            <Sparkles className="size-4" /> Personal Reading Portal
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {greeting()}, {user?.name || 'Reader'} 👋
          </h1>
          <p className="mt-3 text-sm text-navy-foreground/75 sm:text-base leading-relaxed">
            Welcome to your campus digital library. Discover new books, check loan due dates, and manage hold requests with ease.
          </p>
          <Button asChild className="mt-6 h-11 bg-card text-foreground hover:bg-card/90 font-medium">
            <Link to="/app/browse" className="flex items-center gap-2">
              <Search className="size-4 text-primary" />
              <span>Search books, authors, or categories</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <BookOpenCheck className="absolute -bottom-10 -right-10 size-60 rotate-[-12deg] text-navy-foreground/10 pointer-events-none" />
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Currently Issued"
          value={issued.length}
          icon={BookOpenCheck}
          tone="indigo"
          hint="Books on your shelf"
        />
        <StatCard
          label="Due Soon"
          value={dueSoonCount}
          icon={CalendarClock}
          tone={dueSoonCount > 0 ? 'amber' : 'success'}
          hint="Due within 7 days"
        />
        <StatCard
          label="Active Holds"
          value={pendingReservations}
          icon={Bookmark}
          tone="navy"
          hint="Waiting for copies"
        />
        <StatCard
          label="Reading History"
          value={history.length}
          icon={History}
          tone="success"
          hint="Books completed"
        />
      </div>

      {/* Featured Books Section */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Handpicked Recommendations</p>
            <h2 className="mt-1 text-2xl font-bold">Featured Books</h2>
            <p className="text-sm text-muted-foreground">Top-rated and widely read volumes in the library collection.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5">
            <Link to="/app/browse">
              Browse all <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {books.slice(0, 5).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
