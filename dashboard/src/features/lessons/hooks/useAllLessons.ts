import { useQuery } from "@tanstack/react-query";

import { getAllLessons } from "../api/getAllLessons";

export function useAllLessons() {
  return useQuery({
    queryKey: ["admin-lessons"],
    queryFn: getAllLessons,
  });
}