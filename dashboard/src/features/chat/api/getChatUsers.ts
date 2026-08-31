import { api } from "@/lib/axios";
import type { ChatUser } from "../types/chat";

export async function getChatUsers(
  search?: string
): Promise<ChatUser[]> {
  const response = await api.get<{
    success: boolean;
    data: ChatUser[];
  }>("/chat/users", {
    params: search
      ? { search }
      : undefined,
  });

  return response.data.data;
}