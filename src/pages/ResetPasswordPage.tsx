import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { localBackend } from '@/lib/local-storage-backend';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/Logo';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { ok, error } = localBackend.updatePassword(password);
    setBusy(false);
    if (!ok && error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully');
      navigate('/');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5">
      <div className="surface-card w-full max-w-md p-8 rounded-2xl shadow-xl border border-border">
        <Logo />
        <h1 className="mt-8 text-2xl font-bold">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password with at least 6 characters.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-card px-4 text-sm outline-none focus:border-primary"
              placeholder="At least 6 characters"
            />
          </div>
          <Button disabled={busy} className="w-full h-11">
            Update password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
