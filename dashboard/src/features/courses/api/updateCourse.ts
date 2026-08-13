import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { Course } from "../types/course";
import type { CourseFormData } from "../types/course-form";

interface UpdateCoursePayload {
  id: string;
  data: CourseFormData;
}

export async function updateCourse({
  id,
  data,
}: UpdateCoursePayload) {
  const response =
    await api.put<ApiResponse<Course>>(
      `/courses/${id}`,
      data
    );

  return response.data.data;
}