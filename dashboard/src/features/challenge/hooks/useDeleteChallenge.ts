import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { deleteChallenge } from "../api/deleteChallenge";

export function useDeleteChallenge() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteChallenge,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["challenges"],
      });
    },
  });
}