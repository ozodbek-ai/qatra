import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createQuestion } from "../api/createQuestion";

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-quiz", variables.quizId],
      });
    },
  });
}