import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateReel,
  type UpdateReelInput,
} from "../api/updateReel";

export function useUpdateReel() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: UpdateReelInput
    ) => updateReel(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });

      toast.success(
        "Reel muvaffaqiyatli yangilandi."
      );
    },

    onError: () => {
      toast.error(
        "Reelni yangilashda xatolik yuz berdi."
      );
    },
  });
}