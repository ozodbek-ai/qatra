import { api } from "@/lib/axios";
import type { ChatMessage } from "../types/chat";

export async function getMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const response = await api.get<{
    success: boolean;
    data: ChatMessage[];
  }>(
    `/chat/conversations/${conversationId}/messages`
  );

  return response.data.data;
}