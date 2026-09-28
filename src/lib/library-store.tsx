import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { localBackend } from "./local-storage-backend";
import type { DbBook, DbProfile } from "./mock-data";
import type {
  Book,
  LibraryUser,
  IssuedBook,
  Reservation,
  HistoryEntry,
  AppNotification,
} from "./types";

type LibraryContextValue = {
  user: LibraryUser | null;
  authUser: { id: string; email: string } | null;
  hydrated: boolean;
  loading: boolean;
  books: Book[];
  issued: IssuedBook[];
  reservations: Reservation[];
  history: HistoryEntry[];
  favourites: string[];
  notifications: AppNotification[];
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  getBook: (id: string) => Book | undefined;
  issueBook: (id: string) => Promise<{ ok: boolean; message: string }>;
  reserveBook: (id: string) => Promise<{ ok: boolean; message: string }>;
  cancelReservation: (id: string) => Promise<void>;
  toggleFavourite: (id: string) => Promise<boolean>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  updateProfile: (patch: Partial<LibraryUser>) => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

const mapBook = (b: DbBook): Book => ({
  id: b.id,
  title: b.title,
  author: b.author,
  isbn: b.isbn,
  publisher: b.publisher,
  year: b.year,
  language: b.language,
  category: b.category,
  description: b.description,
  rating: Number(b.rating),
  reviews: 0,
  totalCopies: b.total_copies,
  availableCopies: b.available_copies,
  shelf: b.shelf,
  popularity: b.popularity,
  addedAt: b.created_at,
});

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);
  const [user, setUser] = useState<LibraryUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [issued, setIssued] = useState<IssuedBook[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const dbBooks = localBackend.getBooks();
    setBooks(dbBooks.map(mapBook));

    const current: DbProfile | null = localBackend.getCurrentUser();
    if (current) {
      setAuthUser({ id: current.id, email: current.email });
      setUser({
        id: current.id,
        name: current.name,
        email: current.email,
        role: current.role,
        userId: current.student_id,
        phone: current.phone,
        department: current.department,
        course: current.course,
        year: current.year,
        memberSince: current.member_since,
        avatarColor: "indigo",
      });

      const allLoans = localBackend.getLoans().filter((l) => l.user_id === current.id);
      setIssued(
        allLoans
          .filter((l) => !l.returned_at)
          .map((l) => ({
            id: l.id,
            bookId: l.book_id,
            issueDate: l.issue_date,
            dueDate: l.due_date,
          })),
      );
      setHistory(
        allLoans
          .filter((l) => l.returned_at)
          .map((l) => ({
            id: l.id,
            bookId: l.book_id,
            issueDate: l.issue_date,
            returnDate: l.returned_at ?? "",
          })),
      );

      const allReservations = localBackend
        .getReservations()
        .filter((r) => r.user_id === current.id);
      setReservations(
        allReservations.map((r, index) => ({
          id: r.id,
          bookId: r.book_id,
          reservedAt: r.reserved_at,
          queuePosition: index + 1,
          status: r.status,
        })),
      );

      setFavourites(localBackend.getFavourites(current.id));

      const allNotifs = localBackend.getNotifications().filter((n) => n.user_id === current.id);
      setNotifications(
        allNotifs.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          kind: n.kind,
          read: n.read,
          createdAt: n.created_at,
        })),
      );
    } else {
      setAuthUser(null);
      setUser(null);
      setIssued([]);
      setHistory([]);
      setReservations([]);
      setFavourites([]);
      setNotifications([]);
    }
    setLoading(false);
    setHydrated(true);
  }, []);

  useEffect(() => {
    void refresh();
    const unsubscribe = localBackend.subscribe(() => {
      void refresh();
    });
    return () => unsubscribe();
  }, [refresh]);

  const logout = async () => {
    localBackend.signOut();
    setAuthUser(null);
    setUser(null);
    setIssued([]);
    setHistory([]);
    setFavourites([]);
    setNotifications([]);
  };

  const getBook = (id: string) => books.find((b) => b.id === id);

  const issueBook = async (id: string) => {
    if (!authUser) return { ok: false, message: "Please sign in first." };
    const res = localBackend.issueBook(id, authUser.id);
    if (res.ok) await refresh();
    return res;
  };

  const reserveBook = async (id: string) => {
    if (!authUser) return { ok: false, message: "Please sign in first." };
    const res = localBackend.reserveBook(id, authUser.id);
    if (res.ok) await refresh();
    return res;
  };

  const cancelReservation = async (id: string) => {
    localBackend.cancelReservation(id);
    await refresh();
  };

  const toggleFavourite = async (id: string) => {
    if (!authUser) throw new Error("Please sign in first.");
    const added = localBackend.toggleFavourite(id, authUser.id);
    setFavourites((f) => (added ? [...f, id] : f.filter((x) => x !== id)));
    return added;
  };

  const markRead = async (id: string) => {
    localBackend.markNotificationRead(id);
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    if (authUser) {
      localBackend.markAllNotificationsRead(authUser.id);
      setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    }
  };

  const updateProfile = async (patch: Partial<LibraryUser>) => {
    if (!authUser) return;
    const updateData: Partial<DbProfile> = {};
    if (patch.name !== undefined) updateData.name = patch.name;
    if (patch.phone !== undefined) updateData.phone = patch.phone;
    if (patch.department !== undefined) updateData.department = patch.department;
    if (patch.course !== undefined) updateData.course = patch.course;
    if (patch.year !== undefined) updateData.year = patch.year;
    localBackend.updateProfile(authUser.id, updateData);
    await refresh();
  };

  return (
    <LibraryContext.Provider
      value={{
        user,
        authUser,
        hydrated,
        loading,
        books,
        issued,
        history,
        reservations,
        favourites,
        notifications,
        refresh,
        logout,
        getBook,
        issueBook,
        reserveBook,
        cancelReservation,
        toggleFavourite,
        markRead,
        markAllRead,
        updateProfile,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("Missing library provider");
  return ctx;
}
