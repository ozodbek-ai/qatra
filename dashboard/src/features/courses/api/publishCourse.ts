import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { Course } from "../types/course";

interface PublishCoursePayload {
  id: string;
  isPublished: boolean;
}

export async function publishCourse({
  id,
  isPublished,
}: PublishCoursePayload) {
  const response =
    await api.patch<ApiResponse<Course>>(
      `/courses/${id}/publish`,
      {
        isPublished,
      }
    );

  return response.data.data;
}