import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Course } from "../types/course";

export async function getCourses() {
  const response =
    await api.get<ApiResponse<Course[]>>(
      "/courses"
    );

  return response.data.data;
}