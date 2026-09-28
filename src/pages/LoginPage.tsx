import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  LockKeyhole,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { localBackend } from "@/lib/local-storage-backend";
import { useLibrary } from "@/lib/library-store";
import atrium from "@/assets/library-atrium.jpg";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, hydrated, refresh } = useLibrary();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (hydrated && user) {
      navigate(user.role === "admin" ? "/admin" : "/app", { replace: true });
    }
  }, [hydrated, user, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      if (mode === "reset") {
        setNotice(
          "Simulated reset instructions sent. You can update your password directly or sign in.",
        );
        toast.info("Simulated password reset email sent");
      } else if (mode === "signup") {
        const result = localBackend.signUp(name, email, password);
        if (result.error) throw result.error;
        toast.success(`Account created! Welcome, ${result.user.name}.`);
        await refresh();
        navigate(result.user.role === "admin" ? "/admin" : "/app");
      } else {
        const result = localBackend.signIn(email, password);
        if (result.error) throw result.error;
        toast.success(`Welcome back, ${result.user.name}!`);
        await refresh();
        navigate(result.user.role === "admin" ? "/admin" : "/app");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.04fr_0.96fr]">
      {/* Visual Left Banner */}
      <div className="relative hidden min-h-screen overflow-hidden bg-navy lg:block">
        <img
          src={atrium}
          width={1024}
          height={1280}
          alt="Sunlit university library atrium"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/45" />
        <div className="relative flex min-h-screen flex-col justify-between p-12 xl:p-16">
          <Logo tone="light" showTagline />
          <div className="max-w-lg text-navy-foreground">
            <span className="mb-6 inline-flex items-center gap-2 border border-navy-foreground/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
              <BookOpen className="size-4 text-amber" /> Campus Library Management
            </span>
            <h1 className="font-display text-5xl font-bold leading-tight xl:text-6xl">
              A world of ideas awaits.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-navy-foreground/80">
              Discover what inspires you. Borrow smarter. Keep every chapter of your learning
              journey in one place.
            </p>
          </div>
          <p className="text-sm text-navy-foreground/70">SMART SHELF · Standalone Client Edition</p>
        </div>
      </div>

      {/* Form Right Column */}
      <div className="flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:justify-center lg:px-16 xl:px-28">
        <div className="mb-10 lg:hidden">
          <Logo showTagline />
        </div>
        <div className="mx-auto w-full max-w-[430px]">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition"
          >
            <ArrowLeft className="size-3.5" />
            Back to Library Home
          </Link>
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-indigo-soft text-indigo">
            <LockKeyhole className="size-5" />
          </div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
            Smart Library Portal
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground">
            {mode === "login"
              ? "Welcome back"
              : mode === "signup"
                ? "Create your account"
                : "Reset password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to access your library books and account."
              : mode === "signup"
                ? "Join your university library readers community."
                : "Enter your email to restore account access."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Full name
                <input
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary"
                />
              </label>
            )}

            <label className="block text-sm font-semibold">
              Email address
              <input
                required
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary"
              />
            </label>

            {mode !== "reset" && (
              <label className="block text-sm font-semibold">
                Password
                <div className="relative mt-1.5">
                  <input
                    required
                    minLength={6}
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="h-11 w-full rounded-md border border-input bg-card px-3.5 pr-11 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-2.5 p-1 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-primary" /> Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {notice && (
              <p role="status" className="rounded-md bg-success-soft p-3 text-xs text-foreground">
                {notice}
              </p>
            )}

            <Button disabled={busy} type="submit" className="h-11 w-full gap-2 mt-2">
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New reader?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setNotice("");
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setNotice("");
                }}
                className="text-primary font-semibold hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>

          <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4" /> Standalone Mode · Runs completely in browser
          </p>
        </div>
      </div>
    </div>
  );
}
