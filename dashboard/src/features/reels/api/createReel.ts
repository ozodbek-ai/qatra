import { api } from "@/lib/axios";
import type { Reel } from "../types/reel";

export interface CreateReelInput {
  title: string;
  description?: string;
  video?: File;
  videoUrl?: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
  categoryId?: string;
}

export async function createReel(
  data: CreateReelInput
): Promise<Reel> {
  const formData = new FormData();

  formData.append("title", data.title);

  if (data.description) {
    formData.append(
      "description",
      data.description
    );
  }

  if (data.video) {
    formData.append("video", data.video);
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

  if (data.categoryId) {
    formData.append(
      "categoryId",
      data.categoryId
    );
  }

  formData.append(
    "isPublished",
    String(data.isPublished ?? false)
  );

  const response = await api.post<{
    success: boolean;
    data: Reel;
  }>("/reels", formData);

  return response.data.data;
}