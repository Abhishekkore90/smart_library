import { useState, type FormEvent } from 'react';
import { Bell, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminData, DataTable, field } from '@/components/admin/AdminData';
import { localBackend } from '@/lib/local-storage-backend';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export function AdminAnnouncements() {
  const data = useAdminData();
  const [announcement, setAnnouncement] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    setBusy(true);

    data.profiles.forEach((p) => {
      localBackend.addNotification({
        user_id: p.id,
        title: 'Library Announcement',
        body: announcement.trim(),
        kind: 'announcement',
      });
    });

    toast.success(`Announcement broadcasted to all ${data.profiles.length} members`);
    setAnnouncement('');
    void data.refresh();
    setBusy(false);
  };

  const announcementNotifications = data.notifications.filter((n) => n.kind === 'announcement');

  return (
    <div className="space-y-6 animate-rise-in max-w-4xl">
      <PageHeader
        title="Broadcast Announcements"
        description="Publish announcements and critical notices to all university library members."
      />

      {/* Broadcast Form */}
      <form onSubmit={handleSend} className="surface-card p-6 rounded-xl border border-border space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Announcement Message Content *
          </label>
          <textarea
            required
            maxLength={1000}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Type notice for library members (e.g., holiday timings, new journal arrivals, exam schedule hours)…"
            className={`${field} min-h-28 py-3`}
          />
        </div>

        <Button disabled={busy || !announcement.trim() || data.profiles.length === 0} className="gap-2">
          <Send className="size-4" />
          {busy ? 'Broadcasting…' : 'Send Announcement to All Members'}
        </Button>
      </form>

      {/* Past Announcements */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Recent Announcements History</h2>
        <DataTable
          headers={['Message Content', 'Broadcast Date']}
          rows={announcementNotifications.slice(0, 10).map((n) => [
            <span className="text-sm text-foreground">{n.body}</span>,
            <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(n.created_at)}</span>,
          ])}
        />
      </div>
    </div>
  );
}
