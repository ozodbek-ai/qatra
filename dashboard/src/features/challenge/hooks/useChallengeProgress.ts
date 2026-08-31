import { useQuery } from "@tanstack/react-query";

import { getChallengeProgress } from "../api/getChallengeProgress";

export function useChallengeProgress(
  challengeId?: string
) {
  return useQuery({
    queryKey: [
      "challenge-progress",
      challengeId,
    ],

    queryFn: () =>
      getChallengeProgress(challengeId!),

    enabled: Boolean(challengeId),

    refetchInterval: 15_000,
  });
}