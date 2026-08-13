import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { Lesson } from "../types/lesson";

export async function getLessons(
  courseId: string
) {
  const response =
    await api.get<ApiResponse<Lesson[]>>(
      `/lessons/admin/course/${courseId}`
    );

  return response.data.data;
}