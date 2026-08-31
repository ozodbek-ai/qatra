import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateUserRole,
  type UpdateUserRole,
} from "../api/updateUserRole";

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

      onError: (
        error: any
      ) => {
        toast.error(
          error?.response?.data
            ?.message ??
            "Foydalanuvchi rolini o'zgartirishda xatolik yuz berdi."
        );
      },
    });
  };