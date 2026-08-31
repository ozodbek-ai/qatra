import { api } from "@/lib/axios";

export async function toggleReelLike(
  reelId: string
) {
  const response = await api.post<{
    success: boolean;
    data: {
      liked: boolean;
      likeCount: number;
    };
  }>(`/reels/${reelId}/like`);

  return response.data.data;
}