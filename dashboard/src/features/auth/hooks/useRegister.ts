import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { register } from "../api/register";

type ApiErrorResponse = {
  message?: string;
};

type ApiError = {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
};

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,

    onSuccess() {
      toast.success(
        "Hisobingiz muvaffaqiyatli yaratildi. Endi tizimga kiring.",
      );

      navigate("/login", {
        replace: true,
      });
    },

    onError(error) {
      const apiError =
        error as ApiError;

      const status =
        apiError.response?.status;

      const message =
        apiError.response?.data?.message;

      if (status === 409) {
        toast.error(
          message ??
            "Bu email allaqachon ro'yxatdan o'tgan.",
        );

        return;
      }

      if (status === 400) {
        toast.error(
          message ??
            "Kiritilgan ma'lumotlar noto'g'ri.",
        );

        return;
      }

      toast.error(
        message ??
          "Hisob yaratishda xatolik yuz berdi.",
      );
    },
  });
}