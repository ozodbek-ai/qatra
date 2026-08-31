import { api } from "@/lib/axios";
import type { Reel } from "../types/reel";

export async function getReels(): Promise<Reel[]> {
  const response = await api.get<{
    success: boolean;
    data: Reel[];
  }>("/reels");

  return response.data.data;
}