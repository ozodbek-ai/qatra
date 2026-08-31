import { api } from "@/lib/axios";
import type { Conversation } from "../types/chat";

export async function getConversations(): Promise<
  Conversation[]
> {
  const response = await api.get<{
    success: boolean;
    data: Conversation[];
  }>("/chat/conversations");

  return response.data.data;
}