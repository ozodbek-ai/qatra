import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { acceptChallenge } from "../api/acceptChallenge";

export function useAcceptChallenge() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: acceptChallenge,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["challenges"],
      });
    },
  });
}