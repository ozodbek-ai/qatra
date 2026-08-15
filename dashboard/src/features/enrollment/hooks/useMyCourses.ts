import { useQuery } from "@tanstack/react-query";

import { getMyCourses } from "../api/getMyCourses";

export function useMyCourses(
  enabled = true
) {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: getMyCourses,
    enabled,
  });
}