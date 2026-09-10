import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  Settings,
  LogOut,
  Clapperboard,
  Swords,
  MessageCircle,
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
    title: "Mavjud kurslar",
    href: "/courses",
    icon: GraduationCap,
  },
  {
    title: "Mening kurslarim",
    href: "/my-courses",
    icon: BookOpen,
  },
  {
    title: "Reels",
    href: "/reels",
    icon: Clapperboard,
  },
  {
  title: "Xabarlar",
  href: "/chat",
  icon: MessageCircle,
},
  {
  title: "Musobaqalar",
  href: "/challenges",
  icon: Swords,
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

  const { user, logout } = useAuthStore();

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
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-slate-700 bg-slate-950 lg:flex">

        {/* Logo */}
        <div className="shrink-0 border-b border-slate-700 px-6 py-5">
          <h1 className="text-2xl font-bold text-white">
            Qatra
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Learning Platform
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={(
  { isActive }: { isActive: boolean },
) =>
  [
    "flex items-center gap-3 rounded-xl px-4 py-3",
    "font-medium transition-colors duration-150",

    isActive
      ? "bg-blue-600 text-white shadow-sm"
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
          </div>
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-slate-700 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={20} />

            <span>
              Chiqish
            </span>
          </button>
        </div>
      </aside>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-950 px-6 lg:px-8">

          <div>
            <h1 className="text-xl font-bold text-white">
              Qatra
            </h1>

            <p className="text-sm text-slate-400">
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
              <p className="font-medium text-white">
                {user?.fullName ??
                  "Foydalanuvchi"}
              </p>

              <p className="text-sm text-slate-400">
                {user?.role === "ADMIN"
                  ? "Administrator"
                  : "Student"}
              </p>
            </div>
          </button>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
}