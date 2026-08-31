import { api } from "@/lib/axios";

import type { Reel } from "../types/reel";

export async function getSharedReel(
  reelId: string
): Promise<Reel> {
  const response = await api.get<{
    success: boolean;
    data: Reel;
  }>(
    `/reels/share/${reelId}`
  );

  return response.data.data;
}