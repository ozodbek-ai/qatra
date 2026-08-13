import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import { deleteLesson } from "../api/deleteLesson";

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLesson,

    onSuccess: async () => {
      console.log("DELETE SUCCESS");

      await queryClient.invalidateQueries({
        queryKey: ["lessons"],
      });

      toast.success(
        "Dars muvaffaqiyatli o'chirildi."
      );
    },

    onError: (error) => {
      console.error("DELETE ERROR:", error);

      toast.error(
        "Darsni o'chirishda xatolik yuz berdi."
      );
    },
  });
}