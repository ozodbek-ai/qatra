import { useQuery } from "@tanstack/react-query";

import { getMessages } from "../api/getMessages";

export function useMessages(
  conversationId: string | null
) {
  return useQuery({
    queryKey: [
      "chat-messages",
      conversationId,
    ],

    queryFn: () =>
      getMessages(
        conversationId as string
      ),

    enabled: Boolean(conversationId),

    /*
     * Real-time Socket.IO ishlatamiz.
     *
     * Shuning uchun 5 sekundlik polling
     * kerak emas.
     */
    refetchOnWindowFocus: false,
  });
}