import { api } from "@/lib/axios";

export async function deleteCategory(
  id: string
): Promise<void> {
  await api.delete(
    `/reels/categories/${id}`
  );
}