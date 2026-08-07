import { api } from "@/lib/axios";

export const completeLesson = async (
  lessonId: string
) => {
  const response = await api.post(
    `/progress/${lessonId}/complete`
  );

  return response.data;
};