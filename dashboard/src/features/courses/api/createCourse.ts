import { api } from "@/lib/axios";
// import type { ApiResponse } from "@/types/api";

// import type { Course } from "../types/course";
import type { CourseFormData } from "../types/course-form";

// export async function createCourse(
//   data: CourseFormData
// ) {
//   const response =
//     await api.post<ApiResponse<Course>>(
//       "/courses",
//       data
//     );

//   return response.data.data;
// }

// console.log("POST URL => /courses");

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