import { useQuery } from "@tanstack/react-query";

import { getReelById } from "../api/getReelById";

export function useReel(
  reelId: string
) {
  return useQuery({
    queryKey: [
      "reel",
      reelId,
    ],

    queryFn: () =>
      getReelById(reelId),

    enabled: Boolean(reelId),
  });
}