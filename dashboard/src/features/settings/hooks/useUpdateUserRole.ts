import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateUserRole,
  type UpdateUserRole,
} from "../api/updateUserRole";

import { isAxiosError } from "axios";

export const useUpdateUserRole =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        userId,
        role,
      }: {
        userId: string;
        role: UpdateUserRole;
      }) =>
        updateUserRole(
          userId,
          role
        ),

      onSuccess: (
        response
      ) => {
        toast.success(
          response.message ??
            "Foydalanuvchi roli yangilandi."
        );

        queryClient.invalidateQueries({
          queryKey: [
            "admin-users",
          ],
        });
      },

      onError: (error: unknown) => {
  const message = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ??
      "Foydalanuvchi rolini o'zgartirishda xatolik yuz berdi."
    : "Foydalanuvchi rolini o'zgartirishda xatolik yuz berdi.";

  toast.error(message);
},
    });
  };