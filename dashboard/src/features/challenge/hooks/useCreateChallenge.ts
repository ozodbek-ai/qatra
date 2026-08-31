import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { createChallenge } from "../api/createChallenge";

export function useCreateChallenge() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createChallenge,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["challenges"],
      });
    },
  });
}