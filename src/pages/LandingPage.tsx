import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/lib/library-store';
import hero3dImg from '@/assets/smart-library-hero-3d.jpg';
import shelfImg from '@/assets/smart-shelf-kiosk-3d.jpg';

export function LandingPage() {
  const navigate = useNavigate();
  const { books, user } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredBooks = books.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/app/browse?q=${encodeURIComponent(searchQuery.trim())}` : '/app/browse');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo tone="dark" />
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/app')}
                className="gradient-indigo text-white text-sm"
              >
                Go to Dashboard <ArrowRight className="size-4 ml-1" />
              </Button>
            ) : (
              <>
                <Link
                  to="/app/browse"
                  className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Browse Books
                </Link>
                <Button
                  onClick={() => navigate('/login')}
                  className="gradient-indigo text-white text-sm shadow-[var(--shadow-glow)]"
                >
                  Sign In <ArrowRight className="size-4 ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO with background image & gradient overlay ─── */}
      <section className="relative overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 -z-20">
          <img src={hero3dImg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        {/* Gradient overlay so text remains readable */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/85 to-background" />
        {/* Decorative floating glows */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-amber/15 rounded-full blur-[100px] -z-10 animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="size-3.5 text-amber" /> Smart Library Management
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
              Your University Library,{' '}
              <span className="bg-gradient-to-r from-indigo to-primary bg-clip-text text-transparent">Made Simple</span>
            </h1>

            <p className="text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Search books, check availability, borrow & return — all from one clean dashboard.
              No queues, no confusion.
            </p>

            {/* Search Bar with glass effect */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-indigo/30 transition">
                <Search className="size-4 text-muted-foreground ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="flex-1 bg-transparent border-0 text-sm focus:outline-none placeholder:text-muted-foreground"
                />
                <Button type="submit" size="sm" className="gradient-indigo text-white text-xs px-4 shadow-[var(--shadow-glow)]">
                  Search
                </Button>
              </div>
            </form>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/login?role=student')}
                className="gradient-indigo text-white font-semibold gap-2 shadow-[var(--shadow-glow)] hover:shadow-[0_18px_50px_-12px_rgba(79,70,229,0.6)] transition-shadow"
              >
                <GraduationCap className="size-5" />
                Student Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login?role=admin')}
                className="font-semibold gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 hover:bg-white/80"
              >
                <ShieldCheck className="size-5 text-indigo" />
                Admin Login
              </Button>
            </div>
          </div>

          {/* Right — 3D tilted hero card with depth effect */}
          <div className="perspective-1200 hidden lg:block">
            <div className="tilt-hero-card rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] border border-border/60 bg-card">
              <div className="relative h-80">
                <img
                  src={hero3dImg}
                  alt="Smart Library"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold text-amber uppercase tracking-wider">University Library</p>
                  <p className="text-lg font-bold font-display">Smart Shelf Circulation System</p>
                </div>
                {/* Floating glass badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] font-semibold">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online Now
                </div>
              </div>
            </div>
          </div>
          {/* Mobile hero image (no 3D tilt, just a simple rounded card) */}
          <div className="lg:hidden rounded-2xl overflow-hidden shadow-lift border border-border relative">
            <img src={hero3dImg} alt="Smart Library" className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-semibold text-amber">University Library</p>
              <p className="text-base font-bold font-display">Smart Shelf System</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS strip with glass background ─── */}
      <section className="relative border-y border-border py-10 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10 bg-muted/30" />
        <div className="absolute left-0 top-0 w-40 h-40 bg-indigo/8 rounded-full blur-[80px] -z-10" />
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-amber/8 rounded-full blur-[80px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '15,000+', label: 'Books Available', color: 'text-foreground' },
            { value: '4,800+', label: 'Active Members', color: 'text-indigo' },
            { value: '99%', label: 'On-Time Returns', color: 'text-emerald-600' },
            { value: '24/7', label: 'Online Access', color: 'text-amber' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:bg-white/70 dark:hover:bg-white/15 transition">
              <p className={`font-display text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT YOU CAN DO (3 cards with hover-lift) ─── */}
      <section className="py-16 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo/6 rounded-full blur-[130px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">
            What You Can Do
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group p-6 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-lift hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-white/15 transition-all duration-300 text-center space-y-3">
              <div className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-indigo/20 to-indigo/5 text-indigo flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">Search & Find Books</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Search by title, author, or category. See exact shelf locations and real-time availability.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-lift hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-white/15 transition-all duration-300 text-center space-y-3">
              <div className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-amber/25 to-amber/5 text-amber flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">Borrow & Reserve</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Issue books instantly or reserve unavailable ones. Get notified when your book is ready.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-lift hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-white/15 transition-all duration-300 text-center space-y-3">
              <div className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">Track Due Dates</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                View your borrowed books, due dates, and reading history. Never miss a return deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED BOOKS with background image ─── */}
      <section className="py-16 relative overflow-hidden border-y border-border">
        {/* Subtle shelf image as a faded background */}
        <div className="absolute inset-0 -z-20">
          <img src={shelfImg} alt="" className="w-full h-full object-cover opacity-[0.04]" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 -z-10 bg-background/80" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Popular Books</h2>
            <Link to="/app/browse" className="text-sm font-semibold text-indigo hover:underline flex items-center gap-1">
              View All <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredBooks.map((book, i) => (
              <div
                key={book.id}
                className="group rounded-2xl border border-white/60 dark:border-white/15 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-lift hover:-translate-y-2 hover:bg-white/70 dark:hover:bg-white/15 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Book visual header with gradient */}
                <div className="h-36 bg-gradient-to-br from-indigo/12 via-muted to-amber/8 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative floating circles */}
                  <div className="absolute -top-4 -right-4 size-20 rounded-full bg-indigo/10 blur-xl group-hover:bg-indigo/20 transition" />
                  <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-amber/10 blur-xl group-hover:bg-amber/20 transition" />
                  <BookOpen className="size-14 text-indigo/30 group-hover:text-indigo/50 group-hover:scale-110 transition-all duration-300 relative z-10" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 text-[10px] font-bold">
                    {book.category}
                  </span>
                  <span className="absolute top-3 right-3 flex items-center gap-0.5 text-[11px] font-bold text-amber bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-border/50">
                    <Star className="size-3 fill-amber" /> {book.rating}
                  </span>
                </div>

                {/* Book info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm line-clamp-1 group-hover:text-indigo transition">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-muted-foreground font-mono">Shelf {book.shelf}</span>
                    <span className="text-emerald-600 font-semibold">
                      {book.availableCopies}/{book.totalCopies} available
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(user ? `/app/books/${book.id}` : '/login')}
                    className="w-full mt-2 h-8 text-xs gradient-indigo text-white shadow-sm hover:shadow-[var(--shadow-glow)] transition-shadow"
                  >
                    {user ? 'View Details' : 'Sign in to Borrow'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TWO PORTALS (Student vs Admin) ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo/6 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber/6 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">
            Choose Your Portal
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Student — with subtle gradient border effect */}
            <div className="group rounded-2xl p-6 bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-lift hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-white/15 transition-all duration-300 space-y-4 relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-indigo/8 blur-2xl -z-10 group-hover:bg-indigo/15 transition" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo/10 text-indigo text-xs font-bold">
                <GraduationCap className="size-4" /> For Students
              </div>
              <h3 className="font-display text-xl font-bold">Student Portal</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Search and browse all library books
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> View your borrowed books & due dates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Reserve books & manage favourites
                </li>
              </ul>
              <Button
                onClick={() => navigate('/login?role=student')}
                className="w-full gradient-indigo text-white font-semibold gap-2 shadow-sm hover:shadow-[var(--shadow-glow)] transition-shadow"
              >
                Login as Student <ArrowRight className="size-4" />
              </Button>
            </div>

            {/* Admin — dark card with warm glow */}
            <div className="group rounded-2xl p-6 bg-navy/80 backdrop-blur-xl text-navy-foreground border border-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_60px_-15px_rgba(245,158,11,0.2)] hover:-translate-y-1 hover:bg-navy/90 transition-all duration-300 space-y-4 relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-amber/15 blur-2xl -z-10 group-hover:bg-amber/25 transition" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/20 text-amber text-xs font-bold">
                <ShieldCheck className="size-4" /> For Librarians
              </div>
              <h3 className="font-display text-xl font-bold text-white">Admin Portal</h3>
              <ul className="space-y-2 text-xs text-navy-foreground/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-amber shrink-0" /> Add, edit, and manage book catalog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-amber shrink-0" /> Issue & return books, track fines
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-amber shrink-0" /> View reports & manage members
                </li>
              </ul>
              <Button
                onClick={() => navigate('/login?role=admin')}
                className="w-full bg-amber text-navy hover:bg-amber/90 font-bold gap-2 shadow-sm hover:shadow-[0_12px_30px_-8px_rgba(245,158,11,0.4)] transition-shadow"
              >
                Login as Admin <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA with hero background ─── */}
      <section className="relative py-16 text-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 -z-20">
          <img src={hero3dImg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 -z-10 bg-navy/90 backdrop-blur-sm" />

        <div className="max-w-2xl mx-auto px-4 space-y-4 text-white relative">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-sm text-white/70">
            Sign in to borrow books, track due dates, and manage your library account.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-amber text-navy hover:bg-amber/90 font-bold px-8 shadow-[0_12px_30px_-8px_rgba(245,158,11,0.5)]"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/app/browse')}
              className="border-white/30 text-white hover:bg-white/10 px-8"
            >
              Browse Books
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white/40 dark:bg-white/5 backdrop-blur-md border-t border-border py-8 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo tone="dark" compact />
            <span>&copy; {new Date().getFullYear()} Smart Library. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-foreground transition">Sign In</Link>
            <Link to="/app/browse" className="hover:text-foreground transition">Browse</Link>
            <Link to="/reset-password" className="hover:text-foreground transition">Reset Password</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default LandingPage;
