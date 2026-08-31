import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateCourse } from "../api/updateCourse";

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,

    onSuccess() {
      toast.success(
        "Kurs muvaffaqiyatli yangilandi."
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