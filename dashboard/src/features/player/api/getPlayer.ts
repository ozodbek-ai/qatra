import { api } from "@/lib/axios";
import type { PlayerData } from "../types/player";

export const getPlayer = async (
  courseId: string
): Promise<PlayerData> => {
  const response = await api.get<{
    success: boolean;
    data: PlayerData;
  }>(`/player/${courseId}`);

  return response.data.data;
};