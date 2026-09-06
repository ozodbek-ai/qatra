import { api } from "@/lib/axios";

export const markNotificationAsRead =
  async (
    notificationId: string
  ) => {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data.data;
  };