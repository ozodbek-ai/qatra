import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { enroll } from "../api/enroll";

import { isAxiosError } from "axios";

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

    onError: (error: unknown) => {
  const message = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ??
      "Kursga yozilishda xatolik yuz berdi."
    : "Kursga yozilishda xatolik yuz berdi.";

  toast.error(message);
},
  });
}