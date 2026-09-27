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
  role: 'admin' | 'user';
  student_id: string;
  phone: string;
  department: string;
  course: string;
  year: string;
  status: 'active' | 'suspended';
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
  status: 'Pending' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
}

export interface DbFine {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Waived';
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  kind: 'issue' | 'return' | 'due' | 'overdue' | 'reservation' | 'new' | 'announcement';
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
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    publisher: "O'Reilly Media",
    year: 2017,
    language: 'English',
    category: 'Computer Science',
    description: 'The definitive guide to the architecture, scalability, consistency, and reliability of modern distributed data systems.',
    rating: 4.9,
    total_copies: 6,
    available_copies: 4,
    shelf: 'CS-302',
    popularity: 98,
    cover_url: null,
    created_at: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'book-2',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    year: 2008,
    language: 'English',
    category: 'Computer Science',
    description: 'Essential practices, principles, and heuristics for writing readable, maintainable, and elegant software.',
    rating: 4.7,
    total_copies: 5,
    available_copies: 3,
    shelf: 'CS-104',
    popularity: 94,
    cover_url: null,
    created_at: '2024-01-12T11:00:00.000Z',
  },
  {
    id: 'book-3',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson & Gerald Jay Sussman',
    isbn: '978-0262510875',
    publisher: 'MIT Press',
    year: 1996,
    language: 'English',
    category: 'Computer Science',
    description: 'A masterpiece on functional abstraction, recursion, computational models, and the core philosophies of computation.',
    rating: 4.8,
    total_copies: 4,
    available_copies: 2,
    shelf: 'CS-205',
    popularity: 88,
    cover_url: null,
    created_at: '2024-01-15T09:30:00.000Z',
  },
  {
    id: 'book-4',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    isbn: '978-0465050659',
    publisher: 'Basic Books',
    year: 2013,
    language: 'English',
    category: 'Engineering',
    description: 'A cognitive scientist explores how human-centered design principles shape the objects, tools, and interfaces we interact with daily.',
    rating: 4.8,
    total_copies: 5,
    available_copies: 3,
    shelf: 'DS-110',
    popularity: 91,
    cover_url: null,
    created_at: '2024-01-20T14:20:00.000Z',
  },
  {
    id: 'book-5',
    title: 'Linear Algebra and Its Applications',
    author: 'Gilbert Strang',
    isbn: '978-0030105678',
    publisher: 'Cengage Learning',
    year: 2006,
    language: 'English',
    category: 'Mathematics',
    description: 'A renowned pedagogical foundation for vector spaces, eigenvalues, linear transformations, and numerical linear algebra.',
    rating: 4.6,
    total_copies: 8,
    available_copies: 5,
    shelf: 'MATH-201',
    popularity: 85,
    cover_url: null,
    created_at: '2024-01-22T08:15:00.000Z',
  },
  {
    id: 'book-6',
    title: 'The Feynman Lectures on Physics (Vol. 1)',
    author: 'Richard P. Feynman',
    isbn: '978-0465024933',
    publisher: 'Basic Books',
    year: 2011,
    language: 'English',
    category: 'Physics',
    description: 'Classic, insightful lectures covering mechanics, radiation, and heat from one of the most charismatic physicists in history.',
    rating: 4.9,
    total_copies: 4,
    available_copies: 2,
    shelf: 'PHY-102',
    popularity: 89,
    cover_url: null,
    created_at: '2024-01-25T16:00:00.000Z',
  },
  {
    id: 'book-7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0374533557',
    publisher: 'Farrar, Straus and Giroux',
    year: 2011,
    language: 'English',
    category: 'Psychology',
    description: 'An exploration of the two systems of human thought: intuitive, emotional fast thinking and deliberative, logical slow thinking.',
    rating: 4.7,
    total_copies: 6,
    available_copies: 4,
    shelf: 'PSY-301',
    popularity: 92,
    cover_url: null,
    created_at: '2024-02-01T12:00:00.000Z',
  },
  {
    id: 'book-8',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    publisher: 'Harper',
    year: 2015,
    language: 'English',
    category: 'History',
    description: 'From ancient hominids to global dominance, an exhilarating panoramic chronicle of how Homo sapiens conquered planet Earth.',
    rating: 4.8,
    total_copies: 7,
    available_copies: 5,
    shelf: 'HIST-105',
    popularity: 96,
    cover_url: null,
    created_at: '2024-02-05T10:45:00.000Z',
  },
  {
    id: 'book-9',
    title: 'Principles of Economics',
    author: 'N. Gregory Mankiw',
    isbn: '978-1305585126',
    publisher: 'Cengage Learning',
    year: 2017,
    language: 'English',
    category: 'Management',
    description: 'Comprehensive coverage of microeconomics and macroeconomics with clear real-world business and policy illustrations.',
    rating: 4.5,
    total_copies: 5,
    available_copies: 3,
    shelf: 'MGT-204',
    popularity: 80,
    cover_url: null,
    created_at: '2024-02-10T13:30:00.000Z',
  },
  {
    id: 'book-10',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    publisher: 'Harper Perennial Modern Classics',
    year: 2006,
    language: 'English',
    category: 'Literature',
    description: 'An indelible, Pulitzer Prize-winning classic portraying racial injustice, moral courage, and childhood innocence in the American South.',
    rating: 4.9,
    total_copies: 6,
    available_copies: 5,
    shelf: 'LIT-402',
    popularity: 90,
    cover_url: null,
    created_at: '2024-02-14T09:00:00.000Z',
  },
];

export const INITIAL_PROFILES: DbProfile[] = [
  {
    id: 'user-admin',
    name: 'Dr. Eleanor Vance',
    email: 'admin@library.edu',
    role: 'admin',
    student_id: 'ADM-001',
    phone: '+1 (555) 019-2831',
    department: 'Library Administration',
    course: 'Chief Librarian',
    year: 'Staff',
    status: 'active',
    member_since: '2023-01-15T00:00:00.000Z',
    password: 'password',
  },
  {
    id: 'user-student',
    name: 'Alex Rivera',
    email: 'student@library.edu',
    role: 'user',
    student_id: 'STU-2024-089',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    course: 'B.Tech',
    year: '3rd Year',
    status: 'active',
    member_since: '2024-08-20T00:00:00.000Z',
    password: 'password',
  },
  {
    id: 'user-maya',
    name: 'Maya Lin',
    email: 'maya.lin@university.edu',
    role: 'user',
    student_id: 'STU-2024-112',
    phone: '+1 (555) 345-6789',
    department: 'Architecture & Design',
    course: 'M.Arch',
    year: '2nd Year',
    status: 'active',
    member_since: '2024-08-22T00:00:00.000Z',
    password: 'password',
  },
  {
    id: 'user-david',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    role: 'user',
    student_id: 'STU-2024-045',
    phone: '+1 (555) 456-7890',
    department: 'Electrical Engineering',
    course: 'B.Tech',
    year: '4th Year',
    status: 'active',
    member_since: '2024-01-10T00:00:00.000Z',
    password: 'password',
  },
  {
    id: 'user-priya',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    role: 'user',
    student_id: 'STU-2024-210',
    phone: '+1 (555) 567-8901',
    department: 'Biomedical Sciences',
    course: 'B.Sc',
    year: '1st Year',
    status: 'active',
    member_since: '2024-09-01T00:00:00.000Z',
    password: 'password',
  },
];

export const INITIAL_SETTINGS: DbSettings = {
  id: 1,
  name: 'Smart Shelf University Central Library',
  address: 'Science & Engineering Quad, Building 4',
  contact: 'circulations@smartuniversity.edu',
  hours: 'Mon – Sat: 8:00 AM – 10:00 PM | Sun: 10:00 AM – 6:00 PM',
  max_books: 5,
  loan_days: 14,
  fine_per_day: 1,
  reservation_limit: 3,
};

export const INITIAL_LOANS: DbLoan[] = [
  {
    id: 'loan-1',
    book_id: 'book-1',
    user_id: 'user-student',
    issue_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    due_date: new Date(Date.now() + 9 * 86400000).toISOString(),
    returned_at: null,
  },
  {
    id: 'loan-2',
    book_id: 'book-4',
    user_id: 'user-student',
    issue_date: new Date(Date.now() - 20 * 86400000).toISOString(),
    due_date: new Date(Date.now() - 6 * 86400000).toISOString(),
    returned_at: null,
  },
  {
    id: 'loan-3',
    book_id: 'book-2',
    user_id: 'user-student',
    issue_date: new Date(Date.now() - 40 * 86400000).toISOString(),
    due_date: new Date(Date.now() - 26 * 86400000).toISOString(),
    returned_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'loan-4',
    book_id: 'book-6',
    user_id: 'user-david',
    issue_date: new Date(Date.now() - 8 * 86400000).toISOString(),
    due_date: new Date(Date.now() + 6 * 86400000).toISOString(),
    returned_at: null,
  },
  {
    id: 'loan-5',
    book_id: 'book-3',
    user_id: 'user-maya',
    issue_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    due_date: new Date(Date.now() + 11 * 86400000).toISOString(),
    returned_at: null,
  },
];

export const INITIAL_RESERVATIONS: DbReservation[] = [
  {
    id: 'res-1',
    book_id: 'book-3',
    user_id: 'user-student',
    reserved_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'Pending',
  },
  {
    id: 'res-2',
    book_id: 'book-8',
    user_id: 'user-priya',
    reserved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'Ready for Pickup',
  },
];

export const INITIAL_FINES: DbFine[] = [
  {
    id: 'fine-1',
    loan_id: 'loan-2',
    user_id: 'user-student',
    amount: 6.0,
    status: 'Pending',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'fine-2',
    loan_id: 'loan-3',
    user_id: 'user-student',
    amount: 1.0,
    status: 'Paid',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: DbNotification[] = [
  {
    id: 'notif-1',
    user_id: 'user-student',
    title: 'Book Loan Overdue Reminder',
    body: 'The Design of Everyday Things was due 6 days ago. Please return it to avoid additional late fees.',
    kind: 'overdue',
    read: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'user-student',
    title: 'Library Extended Hours for Finals',
    body: 'Central Library will remain open 24/7 during final exam weeks starting next Monday.',
    kind: 'announcement',
    read: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: 'user-student',
    title: 'Book Borrowed Successfully',
    body: 'Designing Data-Intensive Applications has been checked out to STU-2024-089.',
    kind: 'issue',
    read: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const INITIAL_FAVOURITES: { user_id: string; book_id: string }[] = [
  { user_id: 'user-student', book_id: 'book-1' },
  { user_id: 'user-student', book_id: 'book-8' },
];
