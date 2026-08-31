import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createReel,
  type CreateReelInput,
} from "../api/createReel";

export function useCreateReel() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateReelInput
    ) => createReel(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });

      toast.success(
        "Reel muvaffaqiyatli yaratildi."
      );
    },

    onError: () => {
      toast.error(
        "Reel yaratishda xatolik yuz berdi."
      );
    },
  });
}