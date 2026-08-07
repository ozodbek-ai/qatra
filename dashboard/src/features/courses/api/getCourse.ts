import { api } from "@/lib/axios";

import type { Course } from "../types/course";

export const getCourse = async (slug: string) => {
  const response = await api.get<{
    success: boolean;
    data: Course;
  }>(`/courses/${slug}`);

  return response.data.data;
};