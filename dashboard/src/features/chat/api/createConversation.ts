import { api } from "@/lib/axios";
import type { Conversation } from "../types/chat";

export async function createConversation(
  otherUserId: string
): Promise<Conversation> {
  const response = await api.post<{
    success: boolean;
    data: Conversation;
  }>("/chat/conversations", {
    otherUserId,
  });

  return response.data.data;
}