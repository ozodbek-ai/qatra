import { api } from "@/lib/axios";
import type { Reel } from "../types/reel";

export async function getAdminReels(): Promise<Reel[]> {
  const response = await api.get<{
    success: boolean;
    data: Reel[];
  }>("/reels/admin/all");

  return response.data.data;
}