import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { enroll } from "../api/enroll";

export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enroll,

    onSuccess: () => {
      toast.success(
        "Kursga muvaffaqiyatli yozildingiz."
      );

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        "Kursga yozilishda xatolik yuz berdi.";

      toast.error(message);
    },
  });
}