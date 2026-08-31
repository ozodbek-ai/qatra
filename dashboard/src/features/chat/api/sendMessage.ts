import { api } from "@/lib/axios";
import type { ChatMessage } from "../types/chat";

interface SendMessageInput {
  conversationId: string;
  text?: string;
  reelId?: string;
}

export async function sendMessage({
  conversationId,
  text,
  reelId,
}: SendMessageInput): Promise<ChatMessage> {
  const response = await api.post<{
    success: boolean;
    data: ChatMessage;
  }>(
    `/chat/conversations/${conversationId}/messages`,
    {
      text,
      reelId,
    }
  );

  return response.data.data;
}