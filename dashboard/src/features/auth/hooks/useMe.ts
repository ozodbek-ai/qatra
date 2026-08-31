import { useQuery } from "@tanstack/react-query";

import { me } from "../api/me";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const token = useAuthStore(
    (state) => state.accessToken
  );

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    enabled: !!token,
    retry: false,
  });
}