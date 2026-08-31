import { useQuery } from "@tanstack/react-query";
import { getReelComments } from "../api/getComments";

export function useReelComments(
  reelId: string,
  enabled = false
) {
  return useQuery({
    queryKey: [
      "reel-comments",
      reelId,
    ],

    queryFn: () =>
      getReelComments(reelId),

    enabled,
  });
}