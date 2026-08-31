import { api } from "@/lib/axios";
import type { Reel } from "../types/reel";

export async function publishReel(
  reelId: string,
  isPublished: boolean
): Promise<Reel> {
  const response = await api.patch<{
    success: boolean;
    data: Reel;
  }>(
    `/reels/${reelId}/publish`,
    {
      isPublished,
    }
  );

  return response.data.data;
}