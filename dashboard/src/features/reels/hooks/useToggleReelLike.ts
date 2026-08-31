import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toggleReelLike } from "../api/toggleLike";
import { toast } from "sonner";

export function useToggleReelLike() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: toggleReelLike,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reels"],
      });
    },

    onError: () => {
      toast.error(
        "Like bosishda xatolik yuz berdi."
      );
    },
  });
}