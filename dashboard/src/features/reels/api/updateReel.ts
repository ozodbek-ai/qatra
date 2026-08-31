import { api } from "@/lib/axios";

import type {
  Reel,
} from "../types/reel";

export interface UpdateReelInput {
  id: string;

  title: string;

  description?: string;

  video?: File;

  videoUrl?: string;

  thumbnailUrl?: string;

  categoryId?: string | null;
}

export async function updateReel(
  data: UpdateReelInput
): Promise<Reel> {
  const formData = new FormData();

  formData.append(
    "title",
    data.title
  );

  if (data.description !== undefined) {
    formData.append(
      "description",
      data.description
    );
  }

  if (data.video) {
    formData.append(
      "video",
      data.video
    );
  }

  if (data.videoUrl) {
    formData.append(
      "videoUrl",
      data.videoUrl
    );
  }

  if (data.thumbnailUrl) {
    formData.append(
      "thumbnailUrl",
      data.thumbnailUrl
    );
  }

  /*
   * Kategoriya o'zgartirilgan bo'lsa yuboriladi.
   *
   * "__NULL__" backend tomonidan null ga aylantiriladi.
   */
  if (data.categoryId !== undefined) {
    formData.append(
      "categoryId",
      data.categoryId ?? "__NULL__"
    );
  }

  const response = await api.put<{
    success: boolean;
    data: Reel;
  }>(
    `/reels/${data.id}`,
    formData
  );

  return response.data.data;
}