import { api } from "@/lib/axios";
import type { ReelComment } from "../types/reel";

export async function createReelComment(
  reelId: string,
  text: string
): Promise<ReelComment> {
  const response = await api.post<{
    success: boolean;
    data: ReelComment;
  }>(
    `/reels/${reelId}/comments`,
    { text }
  );

  return response.data.data;
}