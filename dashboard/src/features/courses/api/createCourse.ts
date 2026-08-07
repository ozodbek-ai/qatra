import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { Course } from "../types/course";
import type { CourseFormData } from "../types/course-form";

export async function createCourse(
  data: CourseFormData
) {
  const response =
    await api.post<ApiResponse<Course>>(
      "/admin/courses",
      data
    );

  return response.data.data;
}