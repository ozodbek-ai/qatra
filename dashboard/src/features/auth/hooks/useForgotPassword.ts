import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  forgotPassword,
} from "../api/forgotPassword";

type ApiErrorResponse = {
  message?: string;
};

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess(data) {
      toast.success(
        data.message ??
          "Parolni tiklash bo'yicha ko'rsatmalar emailga yuborildi.",
      );
    },

    onError(error) {
      const response = error as {
        response?: {
          data?: ApiErrorResponse;
        };
      };

      toast.error(
        response.response?.data?.message ??
          "Parolni tiklashda xatolik yuz berdi.",
      );
    },
  });
}