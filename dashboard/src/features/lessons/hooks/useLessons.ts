import { useQuery } from "@tanstack/react-query";

import { getLessons } from "../api/getLessons";

export function useLessons(
  courseId: string
) {
  return useQuery({
    queryKey: [
      "lessons",
      courseId,
    ],

    queryFn: () =>
      getLessons(courseId),
  });
}