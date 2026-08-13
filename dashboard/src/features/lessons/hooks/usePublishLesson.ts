import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { publishLesson } from "../api/publishLesson";

export function usePublishLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isPublished,
    }: {
      id: string;
      isPublished: boolean;
    }) =>
      publishLesson(id, isPublished),

    onSuccess(data) {
      toast.success(
        data.isPublished
          ? "Dars muvaffaqiyatli nashr qilindi."
          : "Dars draft holatiga qaytarildi."
      );

      queryClient.invalidateQueries({
        queryKey: ["lessons"],
      });
    },
  });
}