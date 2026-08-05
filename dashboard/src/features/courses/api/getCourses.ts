import { api } from "@/lib/api";

import type { Course } from "../types/course";

export const getCourses = async () => {
  const response = await api.get<{
    success: boolean;
    data: Course[];
  }>("/courses");

  return response.data.data;
};