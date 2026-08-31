import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  updateCategory,
  type UpdateCategoryInput,
} from "../api/updateCategory";

export function useUpdateCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: UpdateCategoryInput
    ) => updateCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reel-categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-reels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["category-reels"],
      });

      toast.success(
        "Kategoriya muvaffaqiyatli yangilandi."
      );
    },

    onError: (error: unknown) => {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      toast.error(
        message ??
          "Kategoriya yangilashda xatolik yuz berdi."
      );
    },
  });
}