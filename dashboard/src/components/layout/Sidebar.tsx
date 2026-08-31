import { NavLink } from "react-router-dom";

import { adminMenu } from "./admin-menu";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Sidebar() {
  const user = useAuthStore(
    (state) => state.user
  );

  const visibleMenu = adminMenu.filter(
    (item) => {
      if (!user) {
        return false;
      }

      return item.allowedRoles.includes(
        user.role
      );
    }
  );

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)] lg:flex lg:flex-col">
      {/* Logo */}

      <div className="border-b border-[var(--color-border)] p-6">
        <h1 className="text-2xl font-bold">
          Qatra Admin
        </h1>

        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Learning Management System
        </p>
      </div>

      {/* Menu */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {visibleMenu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3",
                  "font-medium transition-colors duration-150",

                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
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

      {/* Admin info */}

      <div className="border-t border-[var(--color-border)] p-4">
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-900">
          <p className="truncate text-sm font-semibold">
            {user?.fullName ?? "Administrator"}
          </p>

          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {user?.role === "SUPER_ADMIN"
              ? "Bosh administrator"
              : "Yordamchi administrator"}
          </p>
        </div>
      </div>
    </aside>
  );
}