import { api } from "@/lib/axios";

import type {
  ReelCategory,
} from "../types/category";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: File;
}

export async function createCategory(
  data: CreateCategoryInput
): Promise<ReelCategory> {
  const formData = new FormData();

  formData.append(
    "name",
    data.name
  );

  formData.append(
    "slug",
    data.slug
  );

  if (data.description?.trim()) {
    formData.append(
      "description",
      data.description.trim()
    );
  }

  if (data.image) {
    formData.append(
      "image",
      data.image
    );
  }

  const response = await api.post<{
    success: boolean;
    data: ReelCategory;
  }>(
    "/reels/categories",
    formData
  );

  return response.data.data;
}