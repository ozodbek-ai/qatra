import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  forgotPassword,
} from "../api/forgotPassword";

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess(data) {
      toast.success(
        data.message ??
          "Parolni tiklash bo'yicha ko'rsatmalar emailga yuborildi.",
      );
    },

    onError(error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Parolni tiklashda xatolik yuz berdi.",
      );
    },
  });
}