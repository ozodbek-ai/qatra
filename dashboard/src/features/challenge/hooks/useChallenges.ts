import { useQuery } from "@tanstack/react-query";

import { getMyChallenges } from "../api/getMyChallenges";

export function useChallenges() {
  return useQuery({
    queryKey: ["challenges"],

    queryFn: getMyChallenges,

    refetchInterval: 30_000,
  });
}