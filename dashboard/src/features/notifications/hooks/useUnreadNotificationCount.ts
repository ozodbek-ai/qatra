import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationCount } from
  "../api/getUnreadNotificationCount";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],

    queryFn: getUnreadNotificationCount,
  });
}