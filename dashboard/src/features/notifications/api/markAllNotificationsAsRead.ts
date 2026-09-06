import { api } from "@/lib/axios";

export const markAllNotificationsAsRead =
  async () => {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data.data;
  };