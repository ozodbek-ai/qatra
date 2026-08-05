import { useQuery } from "@tanstack/react-query";

import { me } from "../api/me";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: me,
    retry: false,
    enabled: !!localStorage.getItem("accessToken"),
  });
}