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

    /*
     * Hozircha REST API xabarni yaratadi.
     *
     * Keyingi bosqichda Socket.IO
     * boshqa foydalanuvchilarga
     * real-time event yuboradi.
     */
    onSuccess: (
      message: ChatMessage
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          "chat-messages",
          message.conversationId,
        ],
      });

      /*
       * Muhim:
       *
       * useConversations hook'ida
       * aynan shu queryKey ishlatilgan.
       */
      queryClient.invalidateQueries({
        queryKey: [
          "chat-conversations",
        ],
      });
    },
  });
}