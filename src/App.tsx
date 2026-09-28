import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { LibraryProvider, useLibrary } from "@/lib/library-store";

// Layouts
import { UserLayout } from "@/components/layout/UserLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Pages - Public
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";

// Pages - User Portal
import { UserDashboard } from "@/pages/user/UserDashboard";
import { BrowseBooks } from "@/pages/user/BrowseBooks";
import { BookDetails } from "@/pages/user/BookDetails";
import { MyBooks } from "@/pages/user/MyBooks";
import { ReadingHistory } from "@/pages/user/ReadingHistory";
import { Reservations } from "@/pages/user/Reservations";
import { Favourites } from "@/pages/user/Favourites";
import { Notifications } from "@/pages/user/Notifications";
import { UserProfile } from "@/pages/user/UserProfile";

// Pages - Admin Portal
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminBooks } from "@/pages/admin/AdminBooks";
import { AdminAddBook } from "@/pages/admin/AdminAddBook";
import { AdminIssues } from "@/pages/admin/AdminIssues";
import { AdminReturns } from "@/pages/admin/AdminReturns";
import { AdminMembers } from "@/pages/admin/AdminMembers";
import { AdminReservations } from "@/pages/admin/AdminReservations";
import { AdminFines } from "@/pages/admin/AdminFines";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminReports } from "@/pages/admin/AdminReports";
import { AdminAnnouncements } from "@/pages/admin/AdminAnnouncements";
import { AdminSettings } from "@/pages/admin/AdminSettings";

// Route Guard for Member User Area
function UserRouteGuard() {
  const { user, hydrated } = useLibrary();
  if (!hydrated) return <div className="min-h-screen bg-background animate-pulse" />;
  if (!user) return <Navigate to="/login" replace />;
  return <UserLayout />;
}

// Route Guard for Admin Area
function AdminRouteGuard() {
  const { user, hydrated } = useLibrary();
  if (!hydrated) return <div className="min-h-screen bg-background animate-pulse" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/app" replace />;
  return <AdminLayout />;
}

export function App() {
  return (
    <LibraryProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* User Member Portal Routes */}
          <Route path="/app" element={<UserRouteGuard />}>
            <Route index element={<UserDashboard />} />
            <Route path="browse" element={<BrowseBooks />} />
            <Route path="books/:bookId" element={<BookDetails />} />
            <Route path="my-books" element={<MyBooks />} />
            <Route path="due-dates" element={<MyBooks dueOnly />} />
            <Route path="history" element={<ReadingHistory />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Admin Management Portal Routes */}
          <Route path="/admin" element={<AdminRouteGuard />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="add-book" element={<AdminAddBook />} />
            <Route path="issues" element={<AdminIssues />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="fines" element={<AdminFines />} />
            <Route path="categories" element={<AdminCategories mode="categories" />} />
            <Route path="authors" element={<AdminCategories mode="authors" />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </LibraryProvider>
  );
}

export default App;
