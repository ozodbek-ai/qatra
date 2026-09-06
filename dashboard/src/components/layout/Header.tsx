import {
  Bell,
  LogOut,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store/auth.store";

import {
  useUnreadNotificationCount,
} from "@/features/notifications/hooks/useUnreadNotificationCount";

import {
  useNotificationSocket,
} from "@/features/notifications/hooks/useNotificationSocket";

import {
  NotificationDropdown,
} from "@/features/notifications/components/NotificationDropdown";

import {
  useEffect,
  useRef,
  useState,
} from "react";



export default function Header() {
  const navigate = useNavigate();

  const [
  isNotificationOpen,
  setIsNotificationOpen,
] = useState(false);

const notificationRef =
  useRef<HTMLDivElement>(null);

  useEffect(() => {
  const handleClickOutside = (
    event: MouseEvent
  ) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(
        event.target as Node
      )
    ) {
      setIsNotificationOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  const unreadNotifications =
  useUnreadNotificationCount();

useNotificationSocket();

const unreadCount =
  unreadNotifications.data ?? 0;

  const {
    user,
    logout,
  } = useAuthStore();

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
      .toUpperCase() ?? "A";

  const roleLabel =
    user?.role === "SUPER_ADMIN"
      ? "Bosh administrator"
      : "Yordamchi administrator";

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-6 lg:px-8">
      {/* Page information */}

      <div>
        <h1 className="text-xl font-bold">
          Admin Panel
        </h1>

        <p className="text-sm text-[var(--color-muted)]">
          Qatra boshqaruv tizimi
        </p>
      </div>

      {/* Actions */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2.5 transition hover:bg-slate-800"
          aria-label="Qidirish"
        >
          <Search size={20} />
        </button>

       <div
  ref={notificationRef}
  className="relative"
>
  <button
    type="button"
    onClick={() =>
      setIsNotificationOpen(
        (previous) => !previous
      )
    }
    className="relative rounded-xl p-2.5 transition hover:bg-slate-800"
    aria-label="Bildirishnomalar"
    aria-expanded={isNotificationOpen}
  >
    <Bell size={20} />

    {unreadCount > 0 && (
      <span className="absolute right-1.5 top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">
        {unreadCount > 99
          ? "99+"
          : unreadCount}
      </span>
    )}
  </button>

{isNotificationOpen && (
  <NotificationDropdown
    onClose={() =>
      setIsNotificationOpen(false)
    }
  />
)}
</div>

        {/* User */}

        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2">
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

          <div className="hidden min-w-0 text-left lg:block">
            <p className="truncate font-medium">
              {user?.fullName ?? "Admin"}
            </p>

            <div className="flex items-center gap-1 text-sm text-[var(--color-muted)]">
              <ShieldCheck size={14} />

              <span>
                {roleLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-2 transition hover:bg-red-500/10 hover:text-red-500"
            title="Tizimdan chiqish"
            aria-label="Tizimdan chiqish"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}