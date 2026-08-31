import { api } from "@/lib/axios";

import type { Reel } from "../types/reel";

export async function getReelById(
  reelId: string
): Promise<Reel> {
  const response = await api.get<{
    success: boolean;
    data: Reel;
  }>(
    `/reels/${reelId}`
  );

  return response.data.data;
}