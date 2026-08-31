import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  sendMessage,
} from "../api/sendMessage";

import type {
  ChatMessage,
} from "../types/chat";

export function useSendMessage() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onSuccess: (
      message: ChatMessage
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          "chat-messages",
          message.conversationId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "conversations",
        ],
      });
    },
  });
}