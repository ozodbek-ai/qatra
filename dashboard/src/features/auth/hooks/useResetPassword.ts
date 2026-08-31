import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  resetPassword,
} from "../api/resetPassword";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,

    onSuccess() {
      toast.success(
        "Parolingiz muvaffaqiyatli o'zgartirildi.",
      );

      navigate("/login", {
        replace: true,
      });
    },

    onError(error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Parolni o'zgartirishda xatolik yuz berdi.",
      );
    },
  });
}