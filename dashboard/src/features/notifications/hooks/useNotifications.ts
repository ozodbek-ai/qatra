import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/getNotifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],

    queryFn: getNotifications,
  });
}