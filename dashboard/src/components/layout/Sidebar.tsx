import { NavLink } from "react-router-dom";

import { adminMenu } from "./admin-menu";

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-[var(--color-border)] bg-[var(--color-card)] lg:flex lg:flex-col">
      <div className="border-b border-[var(--color-border)] p-6">
        <h1 className="text-2xl font-bold">
          Qatra Admin
        </h1>

        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Learning Management System
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {adminMenu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
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

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}