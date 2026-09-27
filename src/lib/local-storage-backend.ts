import {
  INITIAL_BOOKS,
  INITIAL_PROFILES,
  INITIAL_SETTINGS,
  INITIAL_LOANS,
  INITIAL_RESERVATIONS,
  INITIAL_FINES,
  INITIAL_NOTIFICATIONS,
  INITIAL_FAVOURITES,
  type DbBook,
  type DbProfile,
  type DbSettings,
  type DbLoan,
  type DbReservation,
  type DbFine,
  type DbNotification,
} from './mock-data';

const STORAGE_KEYS = {
  BOOKS: 'smart_shelf_books_v1',
  PROFILES: 'smart_shelf_profiles_v1',
  SETTINGS: 'smart_shelf_settings_v1',
  LOANS: 'smart_shelf_loans_v1',
  RESERVATIONS: 'smart_shelf_reservations_v1',
  FINES: 'smart_shelf_fines_v1',
  NOTIFICATIONS: 'smart_shelf_notifications_v1',
  FAVOURITES: 'smart_shelf_favourites_v1',
  SESSION: 'smart_shelf_session_user_v1',
} as const;

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getStored<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('smart_shelf_change', { detail: { key } }));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
}

export const localBackend = {
  subscribe(callback: () => void): () => void {
    if (!isClient()) return () => {};
    const handler = () => callback();
    window.addEventListener('smart_shelf_change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('smart_shelf_change', handler);
      window.removeEventListener('storage', handler);
    };
  },

  // --- Auth Simulation ---
  getCurrentUser(): DbProfile | null {
    return getStored<DbProfile | null>(STORAGE_KEYS.SESSION, null);
  },

  signIn(email: string, password?: string): { user: DbProfile; error: null } | { user: null; error: Error } {
    const profiles = this.getProfiles();
    const cleanEmail = email.trim().toLowerCase();
    let found = profiles.find((p) => p.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Auto-create user for demo convenience if signing in with a custom email
      const isAdmin = cleanEmail.includes('admin');
      const emailParts = cleanEmail.split('@');
      const firstPart = emailParts[0] ?? 'demouser';
      const name = firstPart.replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Demo User';
      const newProfile: DbProfile = {
        id: `user-${Date.now()}`,
        name,
        email: cleanEmail,
        role: isAdmin ? 'admin' : 'user',
        student_id: isAdmin ? `ADM-${Math.floor(100 + Math.random() * 900)}` : `STU-2025-${Math.floor(100 + Math.random() * 900)}`,
        phone: '+1 (555) 012-3456',
        department: isAdmin ? 'Library Administration' : 'General Studies',
        course: isAdmin ? 'Staff' : 'Undergraduate',
        year: isAdmin ? 'Staff' : '1st Year',
        status: 'active',
        member_since: new Date().toISOString(),
        password: password || 'password',
      };
      profiles.unshift(newProfile);
      setStored(STORAGE_KEYS.PROFILES, profiles);
      found = newProfile;
    }

    setStored(STORAGE_KEYS.SESSION, found);
    return { user: found, error: null };
  },

  signUp(name: string, email: string, password?: string): { user: DbProfile; error: null } | { user: null; error: Error } {
    const profiles = this.getProfiles();
    const cleanEmail = email.trim().toLowerCase();
    const existing = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { user: null, error: new Error('An account with this email already exists.') };
    }

    const isAdmin = cleanEmail.includes('admin');
    const newProfile: DbProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'New Member',
      email: cleanEmail,
      role: isAdmin ? 'admin' : 'user',
      student_id: isAdmin ? `ADM-${Math.floor(100 + Math.random() * 900)}` : `STU-2025-${Math.floor(100 + Math.random() * 900)}`,
      phone: '',
      department: 'Computer Science',
      course: 'B.Tech',
      year: '1st Year',
      status: 'active',
      member_since: new Date().toISOString(),
      password: password || 'password',
    };

    profiles.push(newProfile);
    setStored(STORAGE_KEYS.PROFILES, profiles);
    setStored(STORAGE_KEYS.SESSION, newProfile);
    return { user: newProfile, error: null };
  },

  signOut(): void {
    if (!isClient()) return;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.dispatchEvent(new CustomEvent('smart_shelf_change', { detail: { key: STORAGE_KEYS.SESSION } }));
  },

  updatePassword(password: string): { ok: boolean; error: Error | null } {
    const current = this.getCurrentUser();
    if (!current) return { ok: false, error: new Error('Not authenticated') };
    const profiles = this.getProfiles();
    const idx = profiles.findIndex((p) => p.id === current.id);
    if (idx !== -1) {
      const existing = profiles[idx];
      if (existing) {
        existing.password = password;
        setStored(STORAGE_KEYS.PROFILES, profiles);
        setStored(STORAGE_KEYS.SESSION, existing);
      }
    }
    return { ok: true, error: null };
  },

  // --- Books ---
  getBooks(): DbBook[] {
    return getStored<DbBook[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  },

  getBook(id: string): DbBook | undefined {
    return this.getBooks().find((b) => b.id === id);
  },

  addBook(data: Partial<DbBook>): { data: DbBook; error: null } {
    const books = this.getBooks();
    const newBook: DbBook = {
      id: `book-${Date.now()}`,
      title: data.title || 'Untitled Book',
      author: data.author || 'Unknown Author',
      isbn: data.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      publisher: data.publisher || 'Independent Press',
      year: Number(data.year) || new Date().getFullYear(),
      language: data.language || 'English',
      category: data.category || 'General',
      description: data.description || '',
      rating: Number(data.rating) || 4.5,
      total_copies: Number(data.total_copies) || 1,
      available_copies: Number(data.available_copies ?? data.total_copies) || 1,
      shelf: data.shelf || 'GEN-101',
      popularity: Math.floor(60 + Math.random() * 35),
      cover_url: data.cover_url || null,
      created_at: new Date().toISOString(),
    };
    books.unshift(newBook);
    setStored(STORAGE_KEYS.BOOKS, books);
    return { data: newBook, error: null };
  },

  updateBook(id: string, patch: Partial<DbBook>): { data: DbBook | null; error: Error | null } {
    const books = this.getBooks();
    const idx = books.findIndex((b) => b.id === id);
    const existing = books[idx];
    if (idx === -1 || !existing) return { data: null, error: new Error('Book not found') };
    const updated: DbBook = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    books[idx] = updated;
    setStored(STORAGE_KEYS.BOOKS, books);
    return { data: updated, error: null };
  },

  deleteBook(id: string): { ok: boolean; error: Error | null } {
    const books = this.getBooks().filter((b) => b.id !== id);
    setStored(STORAGE_KEYS.BOOKS, books);
    return { ok: true, error: null };
  },

  // --- Profiles & Users ---
  getProfiles(): DbProfile[] {
    return getStored<DbProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },

  updateProfile(id: string, patch: Partial<DbProfile>): { ok: boolean; error: Error | null } {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex((p) => p.id === id);
    const existing = profiles[idx];
    if (idx === -1 || !existing) return { ok: false, error: new Error('Member not found') };
    const updated: DbProfile = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    profiles[idx] = updated;
    setStored(STORAGE_KEYS.PROFILES, profiles);
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      setStored(STORAGE_KEYS.SESSION, updated);
    }
    return { ok: true, error: null };
  },

  // --- Circulation & Loans ---
  getLoans(): DbLoan[] {
    return getStored<DbLoan[]>(STORAGE_KEYS.LOANS, INITIAL_LOANS);
  },

  issueBook(bookId: string, userId: string): { ok: boolean; message: string; loan?: DbLoan } {
    const books = this.getBooks();
    const book = books.find((b) => b.id === bookId);
    if (!book) return { ok: false, message: 'Book not found' };
    if (book.available_copies <= 0) return { ok: false, message: 'No copies currently available' };

    const loans = this.getLoans();
    const activeUserLoans = loans.filter((l) => l.user_id === userId && !l.returned_at);
    const settings = this.getSettings();
    if (activeUserLoans.length >= settings.max_books) {
      return { ok: false, message: `Borrowing limit reached (${settings.max_books} books maximum)` };
    }

    // Decrement copies
    book.available_copies -= 1;
    setStored(STORAGE_KEYS.BOOKS, books);

    const loanDays = settings.loan_days || 14;
    const now = new Date();
    const dueDate = new Date(now.getTime() + loanDays * 86400000);

    const newLoan: DbLoan = {
      id: `loan-${Date.now()}`,
      book_id: bookId,
      user_id: userId,
      issue_date: now.toISOString(),
      due_date: dueDate.toISOString(),
      returned_at: null,
    };

    loans.unshift(newLoan);
    setStored(STORAGE_KEYS.LOANS, loans);

    // Push notification
    this.addNotification({
      user_id: userId,
      title: 'Book Borrowed Successfully',
      body: `"${book.title}" has been issued to your account. Due on ${dueDate.toLocaleDateString()}.`,
      kind: 'issue',
    });

    return { ok: true, message: 'Book issued successfully', loan: newLoan };
  },

  returnBook(loanId: string): { ok: boolean; message: string; fineAmount?: number } {
    const loans = this.getLoans();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { ok: false, message: 'Loan record not found' };
    if (loan.returned_at) return { ok: false, message: 'Book has already been returned' };

    const now = new Date();
    loan.returned_at = now.toISOString();

    // Increment book available copies
    const books = this.getBooks();
    const book = books.find((b) => b.id === loan.book_id);
    if (book) {
      book.available_copies = Math.min(book.total_copies, book.available_copies + 1);
      setStored(STORAGE_KEYS.BOOKS, books);
    }

    setStored(STORAGE_KEYS.LOANS, loans);

    // Check overdue and calculate fine if returned late
    const dueDate = new Date(loan.due_date);
    let fineAmount = 0;
    if (now > dueDate) {
      const settings = this.getSettings();
      const diffDays = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      fineAmount = diffDays * (settings.fine_per_day || 1);

      const fines = this.getFines();
      const newFine: DbFine = {
        id: `fine-${Date.now()}`,
        loan_id: loan.id,
        user_id: loan.user_id,
        amount: fineAmount,
        status: 'Pending',
        created_at: now.toISOString(),
      };
      fines.unshift(newFine);
      setStored(STORAGE_KEYS.FINES, fines);

      this.addNotification({
        user_id: loan.user_id,
        title: 'Overdue Return Fine Added',
        body: `"${book?.title || 'Book'}" was returned ${diffDays} day(s) late. A fine of $${fineAmount.toFixed(2)} has been recorded.`,
        kind: 'overdue',
      });
    }

    this.addNotification({
      user_id: loan.user_id,
      title: 'Book Returned',
      body: `"${book?.title || 'Book'}" has been successfully returned.`,
      kind: 'return',
    });

    return { ok: true, message: 'Book returned successfully', fineAmount };
  },

  // --- Reservations ---
  getReservations(): DbReservation[] {
    return getStored<DbReservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
  },

  reserveBook(bookId: string, userId: string): { ok: boolean; message: string; reservation?: DbReservation } {
    const reservations = this.getReservations();
    const existing = reservations.find(
      (r) => r.book_id === bookId && r.user_id === userId && ['Pending', 'Ready for Pickup'].includes(r.status)
    );
    if (existing) {
      return { ok: false, message: 'You have already reserved this book' };
    }

    const newRes: DbReservation = {
      id: `res-${Date.now()}`,
      book_id: bookId,
      user_id: userId,
      reserved_at: new Date().toISOString(),
      status: 'Pending',
    };

    reservations.unshift(newRes);
    setStored(STORAGE_KEYS.RESERVATIONS, reservations);

    const book = this.getBook(bookId);
    this.addNotification({
      user_id: userId,
      title: 'Reservation Confirmed',
      body: `Your hold request for "${book?.title || 'Book'}" has been placed.`,
      kind: 'reservation',
    });

    return { ok: true, message: 'Reservation placed successfully', reservation: newRes };
  },

  updateReservationStatus(reservationId: string, status: DbReservation['status']): { ok: boolean } {
    const reservations = this.getReservations();
    const idx = reservations.findIndex((r) => r.id === reservationId);
    if (idx !== -1) {
      const item = reservations[idx];
      if (item) {
        item.status = status;
        setStored(STORAGE_KEYS.RESERVATIONS, reservations);
      }
    }
    return { ok: true };
  },

  cancelReservation(reservationId: string): { ok: boolean } {
    return this.updateReservationStatus(reservationId, 'Cancelled');
  },

  // --- Fines ---
  getFines(): DbFine[] {
    return getStored<DbFine[]>(STORAGE_KEYS.FINES, INITIAL_FINES);
  },

  updateFineStatus(fineId: string, status: DbFine['status']): { ok: boolean } {
    const fines = this.getFines();
    const idx = fines.findIndex((f) => f.id === fineId);
    if (idx !== -1) {
      const item = fines[idx];
      if (item) {
        item.status = status;
        setStored(STORAGE_KEYS.FINES, fines);
      }
    }
    return { ok: true };
  },

  // --- Notifications ---
  getNotifications(): DbNotification[] {
    return getStored<DbNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  addNotification(notif: { user_id: string; title: string; body: string; kind?: DbNotification['kind'] }): void {
    const notifications = this.getNotifications();
    const newNotif: DbNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: notif.user_id,
      title: notif.title,
      body: notif.body,
      kind: notif.kind || 'announcement',
      read: false,
      created_at: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  markNotificationRead(id: string): void {
    const notifications = this.getNotifications();
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      const item = notifications[idx];
      if (item) {
        item.read = true;
        setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
      }
    }
  },

  markAllNotificationsRead(userId?: string): void {
    const notifications = this.getNotifications();
    notifications.forEach((n) => {
      if (!userId || n.user_id === userId) {
        n.read = true;
      }
    });
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  // --- Settings ---
  getSettings(): DbSettings {
    return getStored<DbSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(patch: Partial<DbSettings>): { ok: boolean } {
    const current = this.getSettings();
    const updated: DbSettings = { ...current, ...patch, id: current.id };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return { ok: true };
  },

  // --- Favourites ---
  getFavourites(userId?: string): string[] {
    const favs = getStored<{ user_id: string; book_id: string }[]>(STORAGE_KEYS.FAVOURITES, INITIAL_FAVOURITES);
    if (!userId) return [];
    return favs.filter((f) => f.user_id === userId).map((f) => f.book_id);
  },

  toggleFavourite(bookId: string, userId: string): boolean {
    const favs = getStored<{ user_id: string; book_id: string }[]>(STORAGE_KEYS.FAVOURITES, INITIAL_FAVOURITES);
    const existingIndex = favs.findIndex((f) => f.user_id === userId && f.book_id === bookId);
    let added = false;
    if (existingIndex !== -1) {
      favs.splice(existingIndex, 1);
      added = false;
    } else {
      favs.push({ user_id: userId, book_id: bookId });
      added = true;
    }
    setStored(STORAGE_KEYS.FAVOURITES, favs);
    return added;
  },

  // Reset to initial mock state (helpful button for testing)
  resetToDefaults(): void {
    if (!isClient()) return;
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    localStorage.setItem(STORAGE_KEYS.FINES, JSON.stringify(INITIAL_FINES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(INITIAL_FAVOURITES));
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.dispatchEvent(new CustomEvent('smart_shelf_change', { detail: { key: 'all' } }));
  },
};
