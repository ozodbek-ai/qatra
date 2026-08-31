import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  deleteCategory,
} from "../api/deleteCategory";

export function useDeleteCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string
    ) => deleteCategory(id),

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

      toast.success(
        "Kategoriya muvaffaqiyatli o'chirildi."
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
          "Kategoriya o'chirishda xatolik yuz berdi."
      );
    },
  });
}