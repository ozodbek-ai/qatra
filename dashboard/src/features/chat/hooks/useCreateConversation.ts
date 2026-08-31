import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createConversation } from "../api/createConversation";

export function useCreateConversation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createConversation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-conversations"],
      });
    },
  });
}