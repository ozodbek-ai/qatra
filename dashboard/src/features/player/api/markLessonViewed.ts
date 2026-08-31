import { api } from "@/lib/axios";

export const markLessonViewed = async (
  lessonId: string
) => {
  const response = await api.post(
    `/player/lessons/${lessonId}/view`
  );

  return response.data.data;
};