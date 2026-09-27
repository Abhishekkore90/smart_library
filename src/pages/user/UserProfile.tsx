import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { UserRound, Save } from 'lucide-react';
import { useLibrary } from '@/lib/library-store';
import { initials, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  const { user, updateProfile } = useLibrary();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: '',
    course: '',
    year: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        course: user.course || '',
        year: user.year || '',
      });
    }
  }, [user]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-rise-in max-w-4xl">
      <PageHeader
        title="Member Profile"
        description="View and update your personal student/faculty details."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Profile Card */}
        <div className="surface-card p-6 text-center rounded-xl border border-border h-fit">
          <span className="mx-auto grid size-24 place-items-center rounded-full gradient-navy text-2xl font-bold text-navy-foreground shadow-md">
            {user ? initials(user.name) : <UserRound className="size-10" />}
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">{user?.name}</h2>
          <p className="text-sm text-primary font-medium">{user?.userId || 'Library Member'}</p>
          <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>

          <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground space-y-1">
            <p>Role: <strong className="text-foreground capitalize">{user?.role}</strong></p>
            <p>Member since: <strong className="text-foreground">{user?.memberSince ? formatDate(user.memberSince) : '—'}</strong></p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={submit} className="surface-card p-6 rounded-xl border border-border space-y-5">
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-3">Account Details</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name</label>
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address</label>
              <input
                disabled
                value={user?.email || ''}
                className="h-10 w-full rounded-md border border-input bg-secondary px-3 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
              <input
                maxLength={30}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Department</label>
              <input
                maxLength={100}
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Computer Science"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Degree / Course</label>
              <input
                maxLength={100}
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                placeholder="e.g. B.Tech"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Academic Year</label>
              <input
                maxLength={50}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 3rd Year"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button disabled={saving} className="gap-2">
              <Save className="size-4" />
              {saving ? 'Saving changes…' : 'Save profile changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
