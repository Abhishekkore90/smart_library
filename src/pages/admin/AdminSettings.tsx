import { useState, useEffect, type FormEvent } from "react";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAdminData, field } from "@/components/admin/AdminData";
import { localBackend } from "@/lib/local-storage-backend";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export function AdminSettings() {
  const data = useAdminData();
  const [settings, setSettings] = useState({
    name: "",
    address: "",
    contact: "",
    hours: "",
    max_books: 5,
    loan_days: 14,
    fine_per_day: 1,
    reservation_limit: 3,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data.settings) {
      setSettings({
        name: data.settings.name || "",
        address: data.settings.address || "",
        contact: data.settings.contact || "",
        hours: data.settings.hours || "",
        max_books: Number(data.settings.max_books || 5),
        loan_days: Number(data.settings.loan_days || 14),
        fine_per_day: Number(data.settings.fine_per_day || 1),
        reservation_limit: Number(data.settings.reservation_limit || 3),
      });
    }
  }, [data.settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    localBackend.updateSettings(settings);
    toast.success("Library circulation policies and details saved");
    void data.refresh();
    setBusy(false);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all library data (books, members, loans) back to initial default demo state?",
      )
    ) {
      localBackend.resetToDefaults();
      toast.success("All demo data reset to defaults");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-rise-in max-w-4xl">
      <PageHeader
        title="Library Policies & Operational Settings"
        description="Configure institution name, borrowing durations, limits, and overdue fine charges."
      />

      <form
        onSubmit={handleSubmit}
        className="surface-card p-6 rounded-xl border border-border grid gap-5 sm:grid-cols-2"
      >
        <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
          Institution / Library Name
          <input
            required
            maxLength={255}
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Campus Address / Location
          <input
            required
            maxLength={255}
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Contact Email / Phone
          <input
            required
            maxLength={255}
            value={settings.contact}
            onChange={(e) => setSettings({ ...settings, contact: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
          Operating Hours Schedule
          <input
            required
            maxLength={255}
            value={settings.hours}
            onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Max Books Allowed per Member
          <input
            required
            type="number"
            min={1}
            max={50}
            value={settings.max_books}
            onChange={(e) => setSettings({ ...settings, max_books: Number(e.target.value) })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Standard Loan Period (Days)
          <input
            required
            type="number"
            min={1}
            max={180}
            value={settings.loan_days}
            onChange={(e) => setSettings({ ...settings, loan_days: Number(e.target.value) })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Late Return Overdue Fee per Day ($)
          <input
            required
            type="number"
            min={0}
            step="0.25"
            value={settings.fine_per_day}
            onChange={(e) => setSettings({ ...settings, fine_per_day: Number(e.target.value) })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Hold / Reservation Queue Limit
          <input
            required
            type="number"
            min={1}
            max={20}
            value={settings.reservation_limit}
            onChange={(e) =>
              setSettings({ ...settings, reservation_limit: Number(e.target.value) })
            }
            className={`${field} mt-1.5`}
          />
        </label>

        <div className="sm:col-span-2 pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border mt-3">
          <Button disabled={busy} className="gap-2">
            <Save className="size-4" />
            {busy ? "Saving…" : "Save Policies"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="text-danger border-danger/30 hover:bg-danger/10 gap-2"
          >
            <RotateCcw className="size-4" /> Reset Demo Data to Default
          </Button>
        </div>
      </form>
    </div>
  );
}
