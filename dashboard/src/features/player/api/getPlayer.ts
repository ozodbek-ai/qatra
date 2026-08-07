import { api } from "@/lib/axios";

import type { PlayerData } from "../types/player";

export const getPlayer = async (
  courseId: string
) => {
  const response = await api.get<{
    success: boolean;
    data: PlayerData;
  }>(`/courses/${courseId}/player`);

  return response.data.data;
};