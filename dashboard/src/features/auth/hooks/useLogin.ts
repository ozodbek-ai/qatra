import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "../api/login";
import { useAuthStore } from "../store/auth.store";

type ApiErrorResponse = {
  message?: string;
};

type ApiError = {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
};

export function useLogin() {
  const auth = useAuthStore();

  return useMutation({
    mutationFn: login,

    onSuccess(response) {
      const {
        accessToken,
        user,
      } = response.data;

      auth.login(
        accessToken,
        user,
      );

      toast.success(
        "Tizimga muvaffaqiyatli kirdingiz.",
      );

      const isAdmin =
        user.role === "ADMIN" ||
        user.role === "SUPER_ADMIN";

      if (isAdmin) {
        window.location.replace("/admin");
        return;
      }

      window.location.replace("/dashboard");
    },

    onError(error) {
      const apiError =
        error as ApiError;

      const status =
        apiError.response?.status;

      const message =
        apiError.response?.data?.message;

      if (
        status === 401 ||
        status === 403
      ) {
        toast.error(
          message ||
            "Login yoki parol noto'g'ri.",
        );

        return;
      }

      toast.error(
        message ||
          "Tizimga kirishda xatolik yuz berdi.",
      );
    },
  });
}