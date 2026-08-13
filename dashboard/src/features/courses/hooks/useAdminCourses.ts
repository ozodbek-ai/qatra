import { useQuery } from "@tanstack/react-query";

import { getAdminCourses } from "../api/getAdminCourses";

export const useAdminCourses = () => {
  return useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAdminCourses,
  });
};