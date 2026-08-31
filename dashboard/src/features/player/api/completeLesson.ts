import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";

interface CompleteLessonResponse {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export async function completeLesson(
  lessonId: string
) {
  const response =
    await api.post<
      ApiResponse<CompleteLessonResponse>
    >(
      `/player/lessons/${lessonId}/complete`
    );

  return response.data.data;
}