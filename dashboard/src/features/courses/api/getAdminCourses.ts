import { api } from "@/lib/axios";
import type { Course } from "../types/course";

export const getAdminCourses = async () => {
  const response = await api.get<{
    success: boolean;
    data: Course[];
  }>("/courses/admin/list");

  return response.data.data;
};