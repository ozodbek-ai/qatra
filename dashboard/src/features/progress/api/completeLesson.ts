import { api } from "@/lib/api";

export const completeLesson = async (
  lessonId: string
) => {
  const response = await api.post(
    `/progress/${lessonId}/complete`
  );

  return response.data;
};