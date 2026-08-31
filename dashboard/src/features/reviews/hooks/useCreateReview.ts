import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  createReview,
  type CreateReviewData,
} from "../api/createReview";

export const useCreateReview = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateReviewData
    ) => createReview(data),

    onSuccess: (_, variables) => {
      toast.success(
        "Kursga baho muvaffaqiyatli berildi."
      );

      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        "Review yuborishda xatolik yuz berdi.";

      toast.error(message);
    },
  });
};