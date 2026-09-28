import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Bell,
  BookMarked,
  CalendarClock,
  ChevronLeft,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { useLibrary } from "@/lib/library-store";
import { cn, initials } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end: boolean;
}

const navItems: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/browse", label: "Search Books", icon: Search, end: false },
  { to: "/app/my-books", label: "My Books", icon: BookMarked, end: false },
  { to: "/app/due-dates", label: "Due Dates", icon: CalendarClock, end: false },
  { to: "/app/reservations", label: "Reservations", icon: Ticket, end: false },
  { to: "/app/history", label: "Reading History", icon: History, end: false },
  { to: "/app/favourites", label: "Favourites", icon: Heart, end: false },
  { to: "/app/notifications", label: "Notifications", icon: Bell, end: false },
  { to: "/app/profile", label: "Profile", icon: UserRound, end: false },
];

export function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, notifications, logout } = useLibrary();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out of Smart Library");
    navigate("/", { replace: true });
  };

  const currentRouteName =
    navItems.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
    )?.label || "Library Member Portal";

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
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

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isNotif = item.to === "/app/notifications";
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {isNotif && unreadCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-amber text-[10px] font-bold text-navy">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Member Profile Footer in Sidebar */}
        <div className="p-3 border-t border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-sidebar-accent/50">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user ? initials(user.name) : "U"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-sidebar-foreground">
                  {user?.name || "Member"}
                </p>
                <p className="text-[10px] text-sidebar-foreground/60 truncate">
                  {user?.userId || "STU"}
                </p>
              </div>
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
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
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
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/85 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-lg border border-border lg:hidden text-foreground hover:bg-secondary"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-base font-semibold text-foreground">{currentRouteName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/app/notifications"
              className="relative p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition"
              title="Notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-amber text-[9px] font-bold text-navy">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/app/profile" className="flex items-center gap-2.5 group">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition">
                {user ? initials(user.name) : "U"}
              </span>
              <span className="hidden sm:block text-xs font-semibold text-foreground group-hover:text-primary transition">
                {user?.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
