import { useQuery } from "@tanstack/react-query";

import { getSettings } from "../api/getSettings";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}