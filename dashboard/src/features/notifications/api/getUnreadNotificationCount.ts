import { api } from "@/lib/axios";

export const getUnreadNotificationCount =
  async (): Promise<number> => {
    const response = await api.get(
      "/notifications/unread-count"
    );

    return response.data.data.count;
  };