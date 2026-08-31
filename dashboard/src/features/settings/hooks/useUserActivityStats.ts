import { useQuery } from "@tanstack/react-query";

import {
  getUserActivityStats,
} from "../api/getUserActivityStats";

export const useUserActivityStats = (
  userId?: string
) => {
  return useQuery({
    queryKey: [
      "user-activity-stats",
      userId,
    ],

    queryFn: () =>
      getUserActivityStats(
        userId as string
      ),

    enabled: Boolean(userId),
  });
};