import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Tags,
  Users,
  BookOpenCheck,
  RotateCcw,
  Bookmark,
  BadgeDollarSign,
  ChartNoAxesCombined,
  Bell,
  Settings,
  UserRound,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end: boolean;
}

const adminNavItems: AdminNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/books", label: "Book Catalog", icon: BookOpen, end: false },
  { to: "/admin/add-book", label: "Add New Book", icon: Plus, end: false },
  { to: "/admin/issues", label: "Issue Circulation", icon: BookOpenCheck, end: false },
  { to: "/admin/returns", label: "Return & Fines", icon: RotateCcw, end: false },
  { to: "/admin/members", label: "Member Directory", icon: UserRound, end: false },
  { to: "/admin/reservations", label: "Reservations", icon: Bookmark, end: false },
  { to: "/admin/fines", label: "Overdue Fines", icon: BadgeDollarSign, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tags, end: false },
  { to: "/admin/authors", label: "Authors", icon: Users, end: false },
  { to: "/admin/reports", label: "Reports & Export", icon: ChartNoAxesCombined, end: false },
  { to: "/admin/announcements", label: "Announcements", icon: Bell, end: false },
  { to: "/admin/settings", label: "Library Settings", icon: Settings, end: false },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useLibrary();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out of Admin Panel");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Admin Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {collapsed ? <LogoMark /> : <Logo tone="light" showTagline />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <div className="px-4 py-2 border-b border-sidebar-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber">
            Admin Portal
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                    isActive
                      ? "bg-amber text-navy font-semibold shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          {!collapsed && (
            <div className="px-3 py-2 mb-2 rounded-lg bg-sidebar-accent/50 text-xs">
              <p className="font-semibold text-sidebar-foreground truncate">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-amber font-medium">Chief Librarian</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-danger-soft hover:bg-danger-soft/10 transition",
              collapsed && "justify-center",
            )}
            title="Sign out"
          >
            <LogOut className="size-4 shrink-0 text-danger" />
            {!collapsed && <span className="text-danger">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-sidebar-border">
              <Logo tone="light" showTagline />
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-sidebar-foreground/80 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-amber text-navy font-semibold"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10"
            >
              <LogOut className="size-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/85 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-lg border border-border lg:hidden text-foreground hover:bg-secondary"
            >
              <Menu className="size-5" />
            </button>
            <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="hidden sm:inline">Smart Library Admin</span>
              <span className="text-foreground">Management Console</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-amber/15 text-amber text-xs font-semibold">
              Admin Access
            </span>
            <span className="text-xs font-semibold text-foreground hidden sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
