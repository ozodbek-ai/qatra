import { api } from "@/lib/axios";

import type {
  ReelCategory,
} from "../types/category";

export interface UpdateCategoryInput {
  id: string;

  name?: string;

  slug?: string;

  description?: string;

  image?: File;
}

export async function updateCategory(
  data: UpdateCategoryInput
): Promise<ReelCategory> {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append(
      "name",
      data.name
    );
  }

  if (data.slug !== undefined) {
    formData.append(
      "slug",
      data.slug
    );
  }

  if (data.description !== undefined) {
    formData.append(
      "description",
      data.description
    );
  }

  if (data.image) {
    formData.append(
      "image",
      data.image
    );
  }

  const response = await api.put<{
    success: boolean;
    data: ReelCategory;
  }>(
    `/reels/categories/${data.id}`,
    formData
  );

  return response.data.data;
}