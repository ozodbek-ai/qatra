import {
  CheckCheck,
  Bell,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  useNotifications,
} from "../hooks/useNotifications";

import {
  useMarkNotificationAsRead,
} from "../hooks/useMarkNotificationAsRead";

import {
  useMarkAllNotificationsAsRead,
} from "../hooks/useMarkAllNotificationsAsRead";

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const navigate = useNavigate();

  const notificationsQuery =
    useNotifications();

  const markAsRead =
    useMarkNotificationAsRead();

  const markAllAsRead =
    useMarkAllNotificationsAsRead();

  const notifications =
    notificationsQuery.data ?? [];

const handleNotificationClick = (
  notification: (typeof notifications)[number]
) => {
  if (!notification.isRead) {
    markAsRead.mutate(notification.id);
  }

  if (notification.link) {
    navigate(notification.link);
  }

  onClose();
};

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[380px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
        <div>
          <h3 className="font-semibold">
            Bildirishnomalar
          </h3>

          <p className="text-xs text-[var(--color-muted)]">
            So'nggi bildirishnomalar
          </p>
        </div>

        {notifications.some(
          (notification) =>
            !notification.isRead
        ) && (
          <button
            type="button"
            onClick={() =>
              markAllAsRead.mutate()
            }
            disabled={
              markAllAsRead.isPending
            }
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-blue-500 transition hover:bg-blue-500/10 disabled:opacity-50"
          >
            <CheckCheck size={15} />

            Barchasini o'qish
          </button>
        )}
      </div>

      {/* Content */}

      <div className="max-h-[420px] overflow-y-auto">
        {notificationsQuery.isLoading ? (
          <div className="px-4 py-10 text-center text-sm text-[var(--color-muted)]">
            Yuklanmoqda...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 rounded-full bg-slate-800 p-3">
              <Bell size={22} />
            </div>

            <p className="font-medium">
              Bildirishnomalar yo'q
            </p>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Yangi bildirishnomalar shu yerda
              ko'rinadi.
            </p>
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                className={`w-full border-b border-[var(--color-border)] px-4 py-4 text-left transition hover:bg-slate-800/50 ${
                  !notification.isRead
                    ? "bg-blue-500/5"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      notification.isRead
                        ? "bg-transparent"
                        : "bg-blue-500"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">
                        {notification.title}
                      </p>

                      <span className="shrink-0 text-xs text-[var(--color-muted)]">
                        {new Date(
                          notification.createdAt
                        ).toLocaleDateString(
                          "uz-UZ"
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}