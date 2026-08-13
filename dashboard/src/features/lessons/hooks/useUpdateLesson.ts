import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateLesson } from "../api/updateLesson";

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateLesson>[1];
    }) => updateLesson(id, data),

    onSuccess() {
      toast.success(
        "Dars muvaffaqiyatli yangilandi."
      );

      queryClient.invalidateQueries({
        queryKey: ["lessons"],
      });
    },
  });
}