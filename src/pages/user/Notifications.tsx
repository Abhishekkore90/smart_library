import { Bell, CheckCheck } from "lucide-react";
import { useLibrary } from "@/lib/library-store";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export function Notifications() {
  const { notifications, markRead, markAllRead } = useLibrary();

  return (
    <div className="space-y-6 animate-rise-in">
      <PageHeader
        title="Library Notifications"
        description="Important announcements, due date warnings, and reservation alerts."
        actions={
          notifications.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void markAllRead()}
              className="gap-2"
            >
              <CheckCheck className="size-4" /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="You will receive alerts here when library books are issued, due, or announced."
        />
      ) : (
        <div className="surface-card divide-y divide-border rounded-xl border border-border overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => void markRead(n.id)}
              className={`flex cursor-pointer items-start gap-4 p-5 transition hover:bg-secondary/40 ${
                n.read ? "opacity-85" : "bg-primary/5"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo mt-0.5">
                <Bell className="size-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-foreground text-sm">{n.title}</h2>
                  {!n.read && <span className="size-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
