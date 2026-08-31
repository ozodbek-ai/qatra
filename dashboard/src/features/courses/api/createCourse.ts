import { api } from "@/lib/axios";
import type { CourseFormData } from "../types/course-form";


export async function createCourse(
  data: CourseFormData
) {
  console.log("API URL:", api.defaults.baseURL);

  const response = await api.post(
    "/courses",
    data
  );

  return response.data.data;
}