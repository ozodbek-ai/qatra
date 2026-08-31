import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { declineChallenge } from "../api/declineChallenge";

export function useDeclineChallenge() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: declineChallenge,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["challenges"],
      });
    },
  });
}