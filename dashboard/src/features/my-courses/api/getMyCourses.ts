import { api } from "@/lib/api";

import type { MyCourse } from "../types/course";

export const getMyCourses = async () => {
  const response = await api.get<{
    success: boolean;
    data: MyCourse[];
  }>("/enrollments/my-courses");

  return response.data.data;
};