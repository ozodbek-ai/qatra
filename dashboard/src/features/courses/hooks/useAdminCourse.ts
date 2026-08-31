import { useQuery } from "@tanstack/react-query";

import { getAdminCourse } from "../api/getAdminCourse";

export const useAdminCourse = (
  courseId: string
) => {
  return useQuery({
    queryKey: [
      "admin-course",
      courseId,
    ],

    queryFn: () =>
      getAdminCourse(courseId),

    enabled: Boolean(courseId),
  });
};