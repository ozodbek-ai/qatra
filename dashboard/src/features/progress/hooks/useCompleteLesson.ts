import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeLesson } from "../api/completeLesson";

export const useCompleteLesson = (
  courseId: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeLesson,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["player", courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });
    },
  });
};