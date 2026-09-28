export type Role = "user" | "admin";

export interface LibraryUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  userId: string;
  phone: string;
  department: string;
  course: string;
  year: string;
  memberSince: string;
  avatarColor: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  language: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  totalCopies: number;
  availableCopies: number;
  shelf: string;
  popularity: number;
  addedAt: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
}

export interface HistoryEntry {
  id: string;
  bookId: string;
  issueDate: string;
  returnDate: string;
}

export type ReservationStatus = "Pending" | "Ready for Pickup" | "Completed" | "Cancelled";

export interface Reservation {
  id: string;
  bookId: string;
  reservedAt: string;
  queuePosition: number;
  status: ReservationStatus;
}

export type NotificationKind =
  "issue" | "return" | "due" | "overdue" | "reservation" | "new" | "announcement";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}
