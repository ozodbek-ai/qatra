import { api } from "@/lib/axios";

import type {
  Notification,
} from "../types/notification";

export const getNotifications =
  async (): Promise<Notification[]> => {
    const response = await api.get(
      "/notifications"
    );

    return response.data.data;
  };