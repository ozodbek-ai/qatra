import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  createCategory,
  type CreateCategoryInput,
} from "../api/createCategory";

export function useCreateCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateCategoryInput
    ) => createCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reel-categories"],
      });

      toast.success(
        "Kategoriya muvaffaqiyatli yaratildi."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Kategoriya yaratishda xatolik yuz berdi."
      );
    },
  });
}