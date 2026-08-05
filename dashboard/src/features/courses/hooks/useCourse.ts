import { useQuery } from "@tanstack/react-query";

import { getCourse } from "../api/getCourse";

export const useCourse = (slug: string) => {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourse(slug),
    enabled: !!slug,
  });
};