import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Compass,
  Heart,
  Layers,
  Menu,
  Search,
  Sparkles,
  Star,
  Ticket,
  X,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/lib/library-store";
import hero3dImg from "@/assets/smart-library-hero-3d.jpg";
import shelfImg from "@/assets/smart-shelf-kiosk-3d.jpg";
import atriumImg from "@/assets/library-atrium.jpg";

export function LandingPage() {
  const navigate = useNavigate();
  const { books, user } = useLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic statistics from library data
  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
  const categoriesCount = new Set(books.map((b) => b.category)).size;

  const featuredBooks = books.slice(0, 4);

  const handleExploreLibrary = () => {
    if (user) {
      navigate("/app/browse");
    } else {
      navigate("/login");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/app/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/app/browse");
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="home"
      className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo/20"
    >
      {/* ─── HEADER / NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo tone="dark" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="text-foreground hover:text-indigo transition font-semibold"
            >
              Home
            </a>
            <button
              type="button"
              onClick={handleExploreLibrary}
              className="text-muted-foreground hover:text-foreground transition font-medium cursor-pointer"
            >
              Explore Library
            </button>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
              className="text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            <a
              href="#showcase"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("showcase");
              }}
              className="text-muted-foreground hover:text-foreground transition"
            >
              Showcase
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("how-it-works");
              }}
              className="text-muted-foreground hover:text-foreground transition"
            >
              How It Works
            </a>
          </nav>

          {/* Desktop Right Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button
                onClick={() => navigate(user.role === "admin" ? "/admin" : "/app")}
                className="gradient-indigo text-white text-sm font-medium shadow-[var(--shadow-glow)]"
              >
                Go to Dashboard <ArrowRight className="size-4 ml-1" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-foreground hover:text-indigo"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleExploreLibrary}
                  className="gradient-indigo text-white text-sm font-medium shadow-[var(--shadow-glow)] hover:shadow-[0_18px_45px_-10px_rgba(79,70,229,0.5)] transition-all"
                >
                  <Compass className="size-4 mr-1.5" />
                  Explore Library
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-foreground hover:bg-muted/70 transition"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col space-y-3 text-base font-medium">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                }}
                className="text-foreground hover:text-indigo py-1 transition"
              >
                Home
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExploreLibrary();
                }}
                className="text-muted-foreground hover:text-foreground py-1 transition text-left font-medium cursor-pointer"
              >
                Explore Library
              </button>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("features");
                }}
                className="text-muted-foreground hover:text-foreground py-1 transition"
              >
                Features
              </a>
              <a
                href="#showcase"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("showcase");
                }}
                className="text-muted-foreground hover:text-foreground py-1 transition"
              >
                Showcase
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                }}
                className="text-muted-foreground hover:text-foreground py-1 transition"
              >
                How It Works
              </a>
            </nav>

            <div className="pt-3 border-t border-border">
              {user ? (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(user.role === "admin" ? "/admin" : "/app");
                  }}
                  className="w-full gradient-indigo text-white font-medium shadow-sm"
                >
                  Go to Dashboard <ArrowRight className="size-4 ml-1" />
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleExploreLibrary();
                    }}
                    className="w-full gradient-indigo text-white font-medium shadow-sm"
                  >
                    <Compass className="size-4 mr-1.5" />
                    Explore Library
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full font-medium"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 isolate">
        {/* Full-bleed background hero image with deep gradient overlay */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <img
            src={hero3dImg}
            alt="University Library Architecture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/90 to-background pointer-events-none" />

        {/* Ambient atmospheric glowing orbs */}
        <div className="absolute top-16 left-1/4 w-80 h-80 bg-indigo/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-8 right-1/4 w-72 h-72 bg-amber/12 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column — Content & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 text-indigo text-xs font-semibold shadow-sm">
              <Sparkles className="size-3.5 text-amber" />
              <span>SMART CAMPUS LIBRARY</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              Discover. Borrow.{" "}
              <span className="bg-gradient-to-r from-indigo via-primary to-indigo bg-clip-text text-transparent">
                Learn.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Your smarter way to explore books, manage borrowing, discover new knowledge, and stay
              connected with your university library.
            </p>

            {/* Search Bar with frosted glass treatment */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/20 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-indigo/40 transition">
                <Search className="size-5 text-muted-foreground ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="flex-1 bg-transparent border-0 text-sm sm:text-base focus:outline-none placeholder:text-muted-foreground/80 px-2 py-1.5"
                />
                <Button
                  type="submit"
                  size="default"
                  className="gradient-indigo text-white text-sm px-6 font-semibold shadow-[var(--shadow-glow)] shrink-0"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Public Action CTAs (No login/sign in buttons) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                size="lg"
                onClick={handleExploreLibrary}
                className="gradient-indigo text-white font-semibold gap-2 shadow-[var(--shadow-glow)] hover:shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transition-all px-7"
              >
                <BookOpen className="size-5" />
                Explore Library
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("features")}
                className="font-semibold gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/20 hover:bg-white/90 px-6"
              >
                <Layers className="size-5 text-indigo" />
                Why Smart Library?
              </Button>
            </div>
          </div>

          {/* Right Column — Premium 3D Hero Visual Card with Glass Overlays */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Frame */}
              <div className="rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(79,70,229,0.25)] border border-white/80 dark:border-white/20 bg-white/40 dark:bg-white/10 backdrop-blur-xl relative group">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                  <img
                    src={hero3dImg}
                    alt="Smart University Library System"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Overlaid Banner info */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1 backdrop-blur-md">
                      Campus Digital Hub
                    </span>
                    <h2 className="text-lg sm:text-xl font-display font-bold text-white drop-shadow-sm">
                      Smart Shelf Circulation System
                    </h2>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">
                      Real-time physical shelf coordinates & digital catalog
                    </p>
                  </div>
                </div>

                {/* Floating Online Badge (Top-right) */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online Catalog</span>
                </div>
              </div>

              {/* Floating Metric Card 1 (Bottom Left Overlay) */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 p-4 rounded-2xl bg-white/70 dark:bg-white/15 backdrop-blur-2xl border border-white/90 dark:border-white/20 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] hidden sm:flex items-center gap-3.5 animate-in fade-in zoom-in duration-500">
                <div className="size-11 rounded-xl gradient-indigo text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BookMarked className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-display font-extrabold text-foreground leading-none">
                    {totalTitles ? `${totalTitles}+` : "16+"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">
                    Cataloged Books
                  </p>
                </div>
              </div>

              {/* Floating Metric Card 2 (Top Left Overlay) */}
              <div className="absolute -top-5 -left-3 sm:-left-5 px-4 py-2.5 rounded-2xl bg-white/75 dark:bg-white/15 backdrop-blur-2xl border border-white/90 dark:border-white/20 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.1)] hidden sm:flex items-center gap-2.5">
                <Zap className="size-4 text-amber shrink-0" />
                <span className="text-xs font-bold text-foreground">24/7 Digital Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST / REAL-TIME STATS STRIP ─── */}
      <section
        id="stats"
        className="relative border-y border-border/60 py-10 overflow-hidden bg-white/30 dark:bg-white/5 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {/* Stat 1 */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200">
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
                {totalTitles ? `${totalTitles}+` : "16+"}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
                Total Books
              </p>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200">
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-600">
                {availableCopies ? `${availableCopies}+` : "45+"}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
                Available Copies
              </p>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200">
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo">
                {categoriesCount ? `${categoriesCount}+` : "8+"}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
                Academic Categories
              </p>
            </div>

            {/* Stat 4 */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200">
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber">
                24/7
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
                Digital Access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. "WHY SMART LIBRARY?" (4 FEATURE CARDS) ─── */}
      <section id="features" className="py-20 relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo/8 rounded-full blur-[140px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo bg-indigo/10 px-3 py-1 rounded-full">
              Key Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-3">
              Why Smart Campus Library?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">
              Designed to elevate academic research and effortless borrowing with modern campus
              technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1: Smart Search */}
            <div className="group p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="size-13 rounded-2xl bg-gradient-to-br from-indigo/20 to-indigo/5 text-indigo flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Search className="size-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Smart Search
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Quickly find books by title, author, category, or ISBN with immediate physical
                  shelf coordinates.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/40 text-[11px] font-semibold text-indigo flex items-center gap-1">
                Instant catalog discovery <ArrowRight className="size-3" />
              </div>
            </div>

            {/* Feature Card 2: Easy Borrowing */}
            <div className="group p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="size-13 rounded-2xl bg-gradient-to-br from-amber/25 to-amber/5 text-amber flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <CalendarClock className="size-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Easy Borrowing
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Manage issued books, inspect due dates, and track renewals in one place without
                  waiting in queue.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/40 text-[11px] font-semibold text-amber flex items-center gap-1">
                Real-time circulation <ArrowRight className="size-3" />
              </div>
            </div>

            {/* Feature Card 3: Reservations */}
            <div className="group p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="size-13 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Ticket className="size-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Instant Reservations
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Reserve currently issued books and receive automatic queue status updates when
                  ready for pickup.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/40 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                Smart queue tracking <ArrowRight className="size-3" />
              </div>
            </div>

            {/* Feature Card 4: Personalized Library */}
            <div className="group p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="size-13 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 text-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="size-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Personalized Library
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Keep track of favourites, review past reading logs, and receive helpful
                  notifications on upcoming due dates.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/40 text-[11px] font-semibold text-pink-600 flex items-center gap-1">
                Custom reading lists <ArrowRight className="size-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FEATURED BOOKS SECTION ─── */}
      <section
        id="books"
        className="py-20 relative overflow-hidden border-y border-border/60 bg-white/20 dark:bg-white/5 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo bg-indigo/10 px-3 py-1 rounded-full">
                Campus Highlights
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2">
                Featured Books
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Explore popular textbooks, research publications, and classic literature.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExploreLibrary}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo hover:text-indigo/80 transition group cursor-pointer"
            >
              Explore Library
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="group rounded-2xl border border-white/80 dark:border-white/15 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-lift hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Book Graphic Header */}
                <div className="h-40 bg-gradient-to-br from-indigo/15 via-muted to-amber/10 flex items-center justify-center relative overflow-hidden p-4">
                  <div className="absolute -top-6 -right-6 size-24 rounded-full bg-indigo/15 blur-xl group-hover:scale-125 transition duration-500" />
                  <div className="absolute -bottom-6 -left-6 size-24 rounded-full bg-amber/15 blur-xl group-hover:scale-125 transition duration-500" />
                  <BookOpen className="size-16 text-indigo/35 group-hover:text-indigo/60 group-hover:scale-110 transition-all duration-300 relative z-10" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md border border-border/60 text-[10px] font-bold text-foreground shadow-sm">
                    {book.category}
                  </span>

                  {/* Rating Pill */}
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-amber bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/60 shadow-sm">
                    <Star className="size-3 fill-amber" />
                    {book.rating || "4.8"}
                  </span>
                </div>

                {/* Book Meta Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-base line-clamp-1 group-hover:text-indigo transition">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {book.author}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs border-t border-border/40 pt-2.5">
                      <span className="text-muted-foreground font-mono text-[11px]">
                        Shelf {book.shelf}
                      </span>
                      <span className="font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">
                        {book.availableCopies} available
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        if (user) {
                          navigate(`/app/books/${book.id}`);
                        } else {
                          navigate("/login");
                        }
                      }}
                      className="w-full h-9 text-xs gradient-indigo text-white font-medium shadow-sm hover:shadow-[var(--shadow-glow)] transition-shadow"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SMART LIBRARY SHOWCASE (IMAGE + CONTENT) ─── */}
      <section id="showcase" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-white/80 dark:border-white/20 bg-white/40 dark:bg-white/10 backdrop-blur-xl">
                <img
                  src={shelfImg}
                  alt="Smart Shelf Digital Terminal"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1 backdrop-blur-md">
                    Smart Shelf Terminal
                  </span>
                  <p className="text-lg font-display font-bold text-white drop-shadow-sm">
                    Intelligent Physical & Digital Circulation
                  </p>
                  <p className="text-xs text-slate-200 mt-0.5 font-medium">
                    Automated issue tracking and RFID integration
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo/10 text-indigo text-xs font-bold">
                <Sparkles className="size-3.5 text-amber" />
                <span>INTELLIGENT CAMPUS INFRASTRUCTURE</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Everything you need to manage your reading journey.
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Combining intuitive digital catalogs with real-time smart shelf integration for
                students, faculty, and academic researchers across the entire campus.
              </p>

              {/* Showcase Bullet Points */}
              <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  "Real-time book availability",
                  "Easy digital reservations",
                  "Due-date tracking & alerts",
                  "Personalized reading history",
                  "Instant favorites bookmarking",
                  "24/7 web access anywhere",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-foreground"
                  >
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={handleExploreLibrary}
                  className="gradient-indigo text-white font-semibold gap-2 shadow-[var(--shadow-glow)] px-7"
                >
                  <Compass className="size-5" />
                  Explore Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. HOW IT WORKS (3-STEP TIMELINE) ─── */}
      <section
        id="how-it-works"
        className="py-20 relative overflow-hidden border-t border-border/60 bg-white/30 dark:bg-white/5 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo bg-indigo/10 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">
              Three simple steps to access your campus library resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-7 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200 space-y-4">
              <span className="font-display text-4xl font-extrabold text-indigo/25">01</span>
              <h3 className="font-display text-xl font-bold text-foreground">Discover</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Search and explore thousands of cataloged volumes across engineering, sciences,
                management, arts, and humanities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-7 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200 space-y-4">
              <span className="font-display text-4xl font-extrabold text-amber/35">02</span>
              <h3 className="font-display text-xl font-bold text-foreground">Borrow</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Find available books, locate their exact shelf code, and manage your issues and
                returns seamlessly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-7 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition duration-200 space-y-4">
              <span className="font-display text-4xl font-extrabold text-emerald-500/30">03</span>
              <h3 className="font-display text-xl font-bold text-foreground">Keep Learning</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Track your due dates, build your reading history, and reserve upcoming high-demand
                books anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FINAL EXPERIENCE CTA ─── */}
      <section className="relative py-24 text-center overflow-hidden isolate bg-slate-900 text-white">
        {/* Cinematic Library Backdrop */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <img src={atriumImg} alt="Library Atrium" className="w-full h-full object-cover opacity-35" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95 pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative text-white space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-400" /> Start Exploring Today
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-sm">
            Your next great read is waiting.
          </h2>

          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
            Explore the Smart Library collection and make every reading session more productive.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              size="lg"
              onClick={handleExploreLibrary}
              className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold px-8 shadow-[0_12px_32px_-8px_rgba(245,158,11,0.5)] hover:scale-105 transition-all text-base gap-2 cursor-pointer"
            >
              Explore Library <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 8. PROFESSIONAL CAMPUS FOOTER ─── */}
      <footer className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border-t border-border/80 pt-16 pb-12 text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border/60">
            {/* Column 1: Brand Info (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Link to="/">
                <Logo tone="dark" />
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                A smarter digital experience for modern campus libraries. Enabling seamless
                borrowing, reservations, and academic research for students and faculty.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-[11px] font-semibold text-foreground">
                <span className="size-2 rounded-full bg-emerald-500" /> Smart Campus Library
                Management System
              </div>
            </div>

            {/* Column 2: Navigation (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("home");
                    }}
                    className="hover:text-foreground transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExploreLibrary}
                    className="hover:text-foreground transition text-left cursor-pointer"
                  >
                    Explore Library
                  </button>
                </li>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("features");
                    }}
                    className="hover:text-foreground transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#showcase"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("showcase");
                    }}
                    className="hover:text-foreground transition"
                  >
                    Showcase
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("how-it-works");
                    }}
                    className="hover:text-foreground transition"
                  >
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Library Features (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={handleExploreLibrary}
                    className="hover:text-foreground transition text-left cursor-pointer"
                  >
                    Book Discovery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExploreLibrary}
                    className="hover:text-foreground transition text-left cursor-pointer"
                  >
                    Borrowing & Circulation
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExploreLibrary}
                    className="hover:text-foreground transition text-left cursor-pointer"
                  >
                    Reservations
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExploreLibrary}
                    className="hover:text-foreground transition text-left cursor-pointer"
                  >
                    Reading History
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Campus Information (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                Campus Library
              </h4>
              <div className="text-xs space-y-1.5 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground">Central Campus Library</p>
                <p>Mon – Sat: 8:00 AM – 10:00 PM</p>
                <p>Sunday: 10:00 AM – 6:00 PM</p>
                <p className="pt-1 text-[11px] text-muted-foreground">
                  Digital Web Catalog: 24/7 Available
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Smart Library. All rights reserved.</p>
            <p className="text-[11px]">Smart Campus Library Management System · Client Edition</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
