import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { completeLesson } from "../api/completeLesson";

export function useCompleteLesson(
  courseId?: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: completeLesson,

    onSuccess() {
      toast.success(
        "Dars muvaffaqiyatli yakunlandi."
      );

      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: [
            "player",
            courseId,
          ],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["player"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });
    },
  });
}