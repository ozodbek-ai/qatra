import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { publishReel } from "../api/publishReel";

export function usePublishReel() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      reelId,
      isPublished,
    }: {
      reelId: string;
      isPublished: boolean;
    }) =>
      publishReel(
        reelId,
        isPublished
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });

      toast.success(
        variables.isPublished
          ? "Reel nashr qilindi."
          : "Reel draft holatiga qaytarildi."
      );
    },

    onError: () => {
      toast.error(
        "Reel holatini o'zgartirishda xatolik yuz berdi."
      );
    },
  });
}