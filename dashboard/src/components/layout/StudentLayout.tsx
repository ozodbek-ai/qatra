import {
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store/auth.store";

const menu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mening kurslarim",
    href: "/my-courses",
    icon: BookOpen,
  },
  {
    title: "Sertifikatlar",
    href: "/certificates",
    icon: Award,
  },
  {
    title: "Sozlamalar",
    href: "/settings",
    icon: Settings,
  },
];

export default function StudentLayout() {
  const navigate = useNavigate();

  const { user, logout } =
    useAuthStore();

  const handleLogout = () => {
    logout();

    toast.success(
      "Tizimdan muvaffaqiyatli chiqdingiz."
    );

    navigate("/login");
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "U";

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">

      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] lg:flex">

        <div className="border-b border-[var(--color-border)] p-6">
          <h1 className="text-2xl font-bold">
            Qatra
          </h1>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Learning Platform
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={20} />

                <span>
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-[var(--color-border)] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={20} />

            <span>
              Chiqish
            </span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-6 lg:px-8">

          <div>
            <h1 className="text-xl font-bold">
              Qatra
            </h1>

            <p className="text-sm text-[var(--color-muted)]">
              Ta'lim platformasi
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/settings")
            }
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-800"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {initials}
              </div>
            )}

            <div className="hidden text-left md:block">
              <p className="font-medium">
                {user?.fullName ?? "Foydalanuvchi"}
              </p>

              <p className="text-sm text-[var(--color-muted)]">
                {user?.role === "ADMIN"
                  ? "Administrator"
                  : "Student"}
              </p>
            </div>
          </button>
        </header>

        {/* Page */}
        <main className="flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}