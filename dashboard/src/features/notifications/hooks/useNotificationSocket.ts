import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { getSocket } from "@/lib/socket";

import type {
  Notification,
} from "../types/notification";

export function useNotificationSocket() {
  const queryClient =
    useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return;
    }

    const handleNewNotification = (
      notification: Notification
    ) => {
      /*
       * Notification list cache'iga
       * yangi notification qo'shamiz.
       */
      queryClient.setQueryData<
        Notification[]
      >(
        ["notifications"],
        (oldNotifications) => {
          if (!oldNotifications) {
            return [notification];
          }

          /*
           * Duplicate notification
           * oldini olamiz.
           */
          const exists =
            oldNotifications.some(
              (item) =>
                item.id === notification.id
            );

          if (exists) {
            return oldNotifications;
          }

          return [
            notification,
            ...oldNotifications,
          ];
        }
      );

      /*
       * Unread count cache'ini
       * yangilaymiz.
       */
      queryClient.setQueryData<number>(
        ["notifications-unread-count"],
        (oldCount) => {
          return (oldCount ?? 0) + 1;
        }
      );
    };

    socket.on(
      "notification:new",
      handleNewNotification
    );

    return () => {
      socket.off(
        "notification:new",
        handleNewNotification
      );
    };
  }, [queryClient]);
}