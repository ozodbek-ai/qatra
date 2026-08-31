import { api } from "@/lib/axios";

import type {
  ReelCategory,
} from "../types/reel";

export async function getCategories(): Promise<
  ReelCategory[]
> {
  const response = await api.get<{
    success: boolean;
    data: ReelCategory[];
  }>("/reels/categories");

  return response.data.data;
}