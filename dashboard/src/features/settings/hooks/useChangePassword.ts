import {
  useMutation,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { changePassword } from "../api/changePassword";

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) =>
      changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      ),

    onSuccess: () => {
      toast.success(
        "Parol muvaffaqiyatli o'zgartirildi."
      );
    },

    onError: () => {
      toast.error(
        "Parolni o'zgartirishda xatolik yuz berdi."
      );
    },
  });
}