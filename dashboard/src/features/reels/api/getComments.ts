import { api } from "@/lib/axios";
import type { ReelComment } from "../types/reel";

export async function getReelComments(
  reelId: string
): Promise<ReelComment[]> {
  const response = await api.get<{
    success: boolean;
    data: ReelComment[];
  }>(`/reels/${reelId}/comments`);

  return response.data.data;
}