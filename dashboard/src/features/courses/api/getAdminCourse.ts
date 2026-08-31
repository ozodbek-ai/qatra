import { api } from "@/lib/axios";
import type { Course } from "../types/course";

export const getAdminCourse = async (
  id: string
): Promise<Course> => {
  const response = await api.get<{
    success: boolean;
    data: Course;
  }>(`/courses/admin/${id}`);

  return response.data.data;
};