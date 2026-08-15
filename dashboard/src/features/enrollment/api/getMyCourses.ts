import { api } from "@/lib/axios";

export async function getMyCourses() {
  const response = await api.get(
    "/enrollments/my-courses"
  );

  return response.data.data;
}