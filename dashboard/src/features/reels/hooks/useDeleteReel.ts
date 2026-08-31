import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteReel } from "../api/deleteReel";

export function useDeleteReel() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteReel,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });

      toast.success(
        "Reel o'chirildi."
      );
    },

    onError: () => {
      toast.error(
        "Reelni o'chirishda xatolik yuz berdi."
      );
    },
  });
}