import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { markNotificationAsRead } from
  "../api/markNotificationAsRead";

export function useMarkNotificationAsRead() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "notifications-unread-count",
        ],
      });
    },
  });
}