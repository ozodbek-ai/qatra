import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCourse } from "../api/createCourse";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,

    onSuccess() {
      toast.success(
        "Kurs muvaffaqiyatli yaratildi."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-courses"],
      });
    },
  });
}