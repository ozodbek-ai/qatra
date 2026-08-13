import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Lesson } from "../types/lesson";

export async function publishLesson(
  id: string,
  isPublished: boolean
) {
  const response =
    await api.patch<ApiResponse<Lesson>>(
      `/lessons/${id}/publish`,
      {
        isPublished,
      }
    );

  return response.data.data;
}