import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createReelComment } from "../api/createComment";
import { toast } from "sonner";

export function useCreateReelComment(
  reelId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      createReelComment(
        reelId,
        text
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "reel-comments",
          reelId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });
    },

    onError: () => {
      toast.error(
        "Izoh yuborishda xatolik yuz berdi."
      );
    },
  });
}