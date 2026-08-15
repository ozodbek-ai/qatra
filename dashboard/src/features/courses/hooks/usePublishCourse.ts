import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { publishCourse } from "../api/publishCourse";

export function usePublishCourse() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: publishCourse,

    onSuccess(data) {
      toast.success(
        data.isPublished
          ? "Kurs muvaffaqiyatli nashr qilindi."
          : "Kurs draft holatiga qaytarildi."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
}