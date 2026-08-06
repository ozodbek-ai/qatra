import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "../api/login";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
  const auth = useAuthStore();

  return useMutation({
    mutationFn: login,

    onSuccess(response) {
      auth.login(
        response.data.accessToken,
        response.data.user
      );

      toast.success("Tizimga muvaffaqiyatli kirdingiz.");
    },
  });
}