import { useCallback, useEffect, useState } from 'react';
import { localBackend } from '@/lib/local-storage-backend';

export type AdminData = {
  books: any[];
  profiles: any[];
  loans: any[];
  reservations: any[];
  fines: any[];
  notifications: any[];
  settings: any | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useAdminData(): AdminData {
  const [state, setState] = useState<Omit<AdminData, 'refresh'>>({
    books: [],
    profiles: [],
    loans: [],
    reservations: [],
    fines: [],
    notifications: [],
    settings: null,
    loading: true,
  });

  const refresh = useCallback(async () => {
    const books = localBackend.getBooks();
    const profiles = localBackend.getProfiles();
    const loans = localBackend.getLoans();
    const reservations = localBackend.getReservations();
    const fines = localBackend.getFines();
    const notifications = localBackend.getNotifications();
    const settings = localBackend.getSettings();

    setState({
      books,
      profiles,
      loans,
      reservations,
      fines,
      notifications,
      settings,
      loading: false,
    });
  }, []);

  useEffect(() => {
    void refresh();
    const unsubscribe = localBackend.subscribe(() => {
      void refresh();
    });
    return () => unsubscribe();
  }, [refresh]);

  return { ...state, refresh };
}

export const field =
  'h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary';

export function DataTable({ headers, rows }: { headers: string[]; rows: (string | number | React.ReactNode)[][] }) {
  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-secondary/60 text-xs uppercase text-muted-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-5 py-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-secondary/30">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No records yet.</p>}
    </div>
  );
}
