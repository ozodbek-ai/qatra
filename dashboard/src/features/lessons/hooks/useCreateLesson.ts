import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { createLesson } from "../api/createLesson";

export function useCreateLesson() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createLesson,

    onSuccess() {
  toast.success(
    "Dars muvaffaqiyatli yaratildi."
  );

  queryClient.invalidateQueries({
    queryKey: ["lessons"],
  });

  queryClient.invalidateQueries({
    queryKey: ["admin-lessons"],
  });
},
  });
}