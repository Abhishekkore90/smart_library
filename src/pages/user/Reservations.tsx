import { Ticket, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLibrary } from '@/lib/library-store';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

export function Reservations() {
  const { reservations, getBook, cancelReservation } = useLibrary();

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Book Hold Reservations"
        description="Track your reserved books and pickup queue status."
      />

      {reservations.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No reservations placed"
          description="When a book is currently unavailable, you can place a hold and track your queue status here."
        />
      ) : (
        <div className="surface-card divide-y divide-border rounded-xl border border-border overflow-hidden">
          {reservations.map((r) => {
            const book = getBook(r.bookId);
            return (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-secondary/20 transition">
                <div>
                  <p className="font-semibold text-foreground">{book?.title || 'Reserved Book'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reserved on {formatDate(r.reservedAt)} · Queue Position #{r.queuePosition}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      r.status === 'Ready for Pickup'
                        ? 'bg-success-soft text-success'
                        : r.status === 'Cancelled'
                          ? 'bg-danger-soft text-danger'
                          : 'bg-amber-soft text-amber'
                    }`}
                  >
                    {r.status}
                  </span>
                  {['Pending', 'Ready for Pickup'].includes(r.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Cancel this reservation hold?')) {
                          void cancelReservation(r.id)
                            .then(() => toast.success('Reservation cancelled'))
                            .catch((e) => toast.error(e.message));
                        }
                      }}
                      className="gap-1.5 text-danger border-danger/30 hover:bg-danger/10"
                    >
                      <X className="size-3.5" /> Cancel Hold
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
