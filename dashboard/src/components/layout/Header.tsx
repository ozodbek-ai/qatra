import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Header() {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();

    toast.success("Tizimdan muvaffaqiyatli chiqdingiz.");

    navigate("/login");
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "A";

  return (
    <header className="flex h-20 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm text-[var(--color-muted)]">
          Admin Panel
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl p-2 transition hover:bg-slate-800">
          <Search size={20} />
        </button>

        <button className="rounded-xl p-2 transition hover:bg-slate-800">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initials}
          </div>

          <div className="hidden text-left lg:block">
            <p className="font-medium">
              {user?.fullName ?? "Admin"}
            </p>

            <p className="text-sm text-[var(--color-muted)]">
              {user?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg p-2 transition hover:bg-slate-800"
            title="Logout"
          >
            <LogOut size={18} />
          </button>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}