import { api } from "@/lib/axios";

import type {
  Reel,
  ReelCategory,
} from "../types/reel";

interface CategoryReelsResponse {
  category: ReelCategory;

  reels: Reel[];
}

export async function getCategoryReels(
  slug: string
): Promise<CategoryReelsResponse> {
  const response = await api.get<{
    success: boolean;
    data: CategoryReelsResponse;
  }>(`/reels/categories/${slug}`);

  return response.data.data;
}