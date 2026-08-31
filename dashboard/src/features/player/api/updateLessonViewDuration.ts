import { api } from "@/lib/axios";

export const updateLessonViewDuration =
  async (
    activityId: string,
    durationSeconds: number
  ) => {
    const response =
      await api.post(
        "/player/lessons/view-duration",
        {
          activityId,
          durationSeconds,
        }
      );

    return response.data.data;
  };