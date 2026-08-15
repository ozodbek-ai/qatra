import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../api/getCourses";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}