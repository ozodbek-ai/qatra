import { useQuery } from "@tanstack/react-query";

import { getPlayer } from "../api/getPlayer";

export const usePlayer = (
  courseId: string
) => {
  return useQuery({
    queryKey: ["player", courseId],
    queryFn: () => getPlayer(courseId),
    enabled: !!courseId,
  });
};