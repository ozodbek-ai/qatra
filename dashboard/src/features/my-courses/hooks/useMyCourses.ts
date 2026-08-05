import { useQuery } from "@tanstack/react-query";

import { getMyCourses } from "../api/getMyCourses";

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: getMyCourses,
  });
};