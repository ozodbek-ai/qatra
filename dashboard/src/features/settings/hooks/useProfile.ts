import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../api/getProfile";

export function useProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });
}