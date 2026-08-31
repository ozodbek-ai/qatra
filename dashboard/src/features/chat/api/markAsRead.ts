import { api } from "@/lib/axios";

export async function markAsRead(
  conversationId: string
) {
  const response = await api.post<{
    success: boolean;
    data: null;
  }>(
    `/chat/conversations/${conversationId}/read`
  );

  return response.data;
}