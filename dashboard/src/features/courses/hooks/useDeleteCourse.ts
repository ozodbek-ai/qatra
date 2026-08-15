import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCourse } from "../api/deleteCourse";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      deleteCourse(courseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-courses"],
      });
    },
  });
};