import { api } from "@/lib/axios";

import type { Course } from "../types/course";

export const getCourses = async () => {
  const response = await api.get<{
    success: boolean;
    data: Course[];
  }>("/courses");

  return response.data.data;
};