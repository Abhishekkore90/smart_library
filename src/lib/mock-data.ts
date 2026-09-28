export interface DbBook {
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
  total_copies: number;
  available_copies: number;
  shelf: string;
  popularity: number;
  cover_url: string | null;
  created_at: string;
}

export interface DbProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  student_id: string;
  phone: string;
  department: string;
  course: string;
  year: string;
  status: "active" | "suspended";
  member_since: string;
  password?: string | undefined;
}

export interface DbLoan {
  id: string;
  book_id: string;
  user_id: string;
  issue_date: string;
  due_date: string;
  returned_at: string | null;
}

export interface DbReservation {
  id: string;
  book_id: string;
  user_id: string;
  reserved_at: string;
  status: "Pending" | "Ready for Pickup" | "Completed" | "Cancelled";
}

export interface DbFine {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  status: "Pending" | "Paid" | "Waived";
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  kind: "issue" | "return" | "due" | "overdue" | "reservation" | "new" | "announcement";
  read: boolean;
  created_at: string;
}

export interface DbSettings {
  id: number;
  name: string;
  address: string;
  contact: string;
  hours: string;
  max_books: number;
  loan_days: number;
  fine_per_day: number;
  reservation_limit: number;
}

export const INITIAL_BOOKS: DbBook[] = [
  {
    id: "book-1",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    publisher: "O'Reilly Media",
    year: 2017,
    language: "English",
    category: "Computer Science",
    description:
      "The definitive guide to the architecture, scalability, consistency, and reliability of modern distributed data systems.",
    rating: 4.9,
    total_copies: 6,
    available_copies: 6,
    shelf: "CS-302",
    popularity: 98,
    cover_url: null,
    created_at: "2024-01-10T10:00:00.000Z",
  },
  {
    id: "book-2",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    publisher: "Prentice Hall",
    year: 2008,
    language: "English",
    category: "Computer Science",
    description:
      "Essential practices, principles, and heuristics for writing readable, maintainable, and elegant software.",
    rating: 4.7,
    total_copies: 5,
    available_copies: 5,
    shelf: "CS-104",
    popularity: 94,
    cover_url: null,
    created_at: "2024-01-12T11:00:00.000Z",
  },
  {
    id: "book-3",
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson & Gerald Jay Sussman",
    isbn: "978-0262510875",
    publisher: "MIT Press",
    year: 1996,
    language: "English",
    category: "Computer Science",
    description:
      "A masterpiece on functional abstraction, recursion, computational models, and the core philosophies of computation.",
    rating: 4.8,
    total_copies: 4,
    available_copies: 4,
    shelf: "CS-205",
    popularity: 88,
    cover_url: null,
    created_at: "2024-01-15T09:30:00.000Z",
  },
  {
    id: "book-4",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    isbn: "978-0465050659",
    publisher: "Basic Books",
    year: 2013,
    language: "English",
    category: "Engineering",
    description:
      "A cognitive scientist explores how human-centered design principles shape the objects, tools, and interfaces we interact with daily.",
    rating: 4.8,
    total_copies: 5,
    available_copies: 5,
    shelf: "DS-110",
    popularity: 91,
    cover_url: null,
    created_at: "2024-01-20T14:20:00.000Z",
  },
  {
    id: "book-5",
    title: "Linear Algebra and Its Applications",
    author: "Gilbert Strang",
    isbn: "978-0030105678",
    publisher: "Cengage Learning",
    year: 2006,
    language: "English",
    category: "Mathematics",
    description:
      "A renowned pedagogical foundation for vector spaces, eigenvalues, linear transformations, and numerical linear algebra.",
    rating: 4.6,
    total_copies: 8,
    available_copies: 8,
    shelf: "MATH-201",
    popularity: 85,
    cover_url: null,
    created_at: "2024-01-22T08:15:00.000Z",
  },
  {
    id: "book-6",
    title: "The Feynman Lectures on Physics (Vol. 1)",
    author: "Richard P. Feynman",
    isbn: "978-0465024933",
    publisher: "Basic Books",
    year: 2011,
    language: "English",
    category: "Physics",
    description:
      "Classic, insightful lectures covering mechanics, radiation, and heat from one of the most charismatic physicists in history.",
    rating: 4.9,
    total_copies: 4,
    available_copies: 4,
    shelf: "PHY-102",
    popularity: 89,
    cover_url: null,
    created_at: "2024-01-25T16:00:00.000Z",
  },
  {
    id: "book-7",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    publisher: "Farrar, Straus and Giroux",
    year: 2011,
    language: "English",
    category: "Psychology",
    description:
      "An exploration of the two systems of human thought: intuitive, emotional fast thinking and deliberative, logical slow thinking.",
    rating: 4.7,
    total_copies: 6,
    available_copies: 6,
    shelf: "PSY-301",
    popularity: 92,
    cover_url: null,
    created_at: "2024-02-01T12:00:00.000Z",
  },
  {
    id: "book-8",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    publisher: "Harper",
    year: 2015,
    language: "English",
    category: "History",
    description:
      "From ancient hominids to global dominance, an exhilarating panoramic chronicle of how Homo sapiens conquered planet Earth.",
    rating: 4.8,
    total_copies: 7,
    available_copies: 7,
    shelf: "HIST-105",
    popularity: 96,
    cover_url: null,
    created_at: "2024-02-05T10:45:00.000Z",
  },
  {
    id: "book-9",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    isbn: "978-1305585126",
    publisher: "Cengage Learning",
    year: 2017,
    language: "English",
    category: "Management",
    description:
      "Comprehensive coverage of microeconomics and macroeconomics with clear real-world business and policy illustrations.",
    rating: 4.5,
    total_copies: 5,
    available_copies: 5,
    shelf: "MGT-204",
    popularity: 80,
    cover_url: null,
    created_at: "2024-02-10T13:30:00.000Z",
  },
  {
    id: "book-10",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    publisher: "Harper Perennial Modern Classics",
    year: 2006,
    language: "English",
    category: "Literature",
    description:
      "An indelible, Pulitzer Prize-winning classic portraying racial injustice, moral courage, and childhood innocence in the American South.",
    rating: 4.9,
    total_copies: 6,
    available_copies: 6,
    shelf: "LIT-402",
    popularity: 90,
    cover_url: null,
    created_at: "2024-02-14T09:00:00.000Z",
  },
];

export const INITIAL_PROFILES: DbProfile[] = [
  {
    id: "user-admin",
    name: "Dr. Eleanor Vance",
    email: "admin123@gmail.com",
    role: "admin",
    student_id: "ADM-001",
    phone: "+1 (555) 019-2831",
    department: "Library Administration",
    course: "Chief Librarian",
    year: "Staff",
    status: "active",
    member_since: "2023-01-15T00:00:00.000Z",
    password: "123456",
  },
];

export const INITIAL_SETTINGS: DbSettings = {
  id: 1,
  name: "Smart Shelf University Central Library",
  address: "Science & Engineering Quad, Building 4",
  contact: "circulations@smartuniversity.edu",
  hours: "Mon – Sat: 8:00 AM – 10:00 PM | Sun: 10:00 AM – 6:00 PM",
  max_books: 5,
  loan_days: 14,
  fine_per_day: 1,
  reservation_limit: 3,
};

export const INITIAL_LOANS: DbLoan[] = [];

export const INITIAL_RESERVATIONS: DbReservation[] = [];

export const INITIAL_FINES: DbFine[] = [];

export const INITIAL_NOTIFICATIONS: DbNotification[] = [];

export const INITIAL_FAVOURITES: { user_id: string; book_id: string }[] = [];
