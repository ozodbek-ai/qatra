import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { getSocket } from "@/lib/socket";

import type {
  ChatMessage,
  Conversation,
} from "../types/chat";

export function useChatSocket() {
  const queryClient =
    useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return;
    }

    const handleNewMessage = (
      message: ChatMessage
    ) => {
      /*
       * Message cache'ni yangilaymiz.
       */
      queryClient.setQueryData<
        ChatMessage[]
      >(
        [
          "chat-messages",
          message.conversationId,
        ],
        (oldMessages) => {
          if (!oldMessages) {
            return [message];
          }

          /*
           * Duplicate message oldini olamiz.
           */
          const exists =
            oldMessages.some(
              (item) =>
                item.id === message.id
            );

          if (exists) {
            return oldMessages;
          }

          return [
            ...oldMessages,
            message,
          ];
        }
      );

      /*
       * Conversation list cache'ini
       * real-time yangilaymiz.
       */
      queryClient.setQueryData<
        Conversation[]
      >(
        ["chat-conversations"],
        (oldConversations) => {
          if (!oldConversations) {
            return oldConversations;
          }

          return oldConversations.map(
            (conversation) => {
              if (
                conversation.id !==
                message.conversationId
              ) {
                return conversation;
              }

              return {
                ...conversation,

                lastMessage: message,

                updatedAt:
                  message.createdAt,
              };
            }
          );
        }
      );

      /*
       * Oxirgi message kelgan conversation
       * ro'yxatda tepaga chiqishi uchun
       * serverdan conversations qayta olinadi.
       */
      queryClient.invalidateQueries({
        queryKey: [
          "chat-conversations",
        ],
      });
    };

    socket.on(
  "message:new",
  handleNewMessage
);

    return () => {
      socket.off(
  "message:new",
  handleNewMessage
);
    };
  }, [queryClient]);
}