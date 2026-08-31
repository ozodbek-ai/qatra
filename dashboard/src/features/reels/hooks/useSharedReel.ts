import { useQuery } from "@tanstack/react-query";

import { getSharedReel } from "../api/getSharedReel";

export function useSharedReel(
  reelId?: string
) {
  return useQuery({
    queryKey: [
      "shared-reel",
      reelId,
    ],

    queryFn: () =>
      getSharedReel(reelId!),

    enabled: Boolean(reelId),
  });
}