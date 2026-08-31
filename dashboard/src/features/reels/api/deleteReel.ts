import { api } from "@/lib/axios";

export async function deleteReel(
  reelId: string
) {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(
    `/reels/${reelId}`
  );

  return response.data;
}