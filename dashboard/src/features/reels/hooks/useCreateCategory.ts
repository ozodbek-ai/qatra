import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { isAxiosError } from "axios";

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

    onError: (error: unknown) => {
  const message = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ??
      "Kategoriya yaratishda xatolik yuz berdi."
    : "Kategoriya yaratishda xatolik yuz berdi.";

  toast.error(message);
},
  });
}