import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { uploadAvatar } from "../api/uploadAvatar";

import { useAuthStore } from "@/features/auth/store/auth.store";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  const user = useAuthStore(
    (state) => state.user
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  return useMutation({
    mutationFn: uploadAvatar,

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-profile"],
        data
      );

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });
      }

      toast.success(
        "Profil rasmi muvaffaqiyatli yangilandi."
      );
    },

    onError: () => {
      toast.error(
        "Profil rasmini yuklashda xatolik yuz berdi."
      );
    },
  });
}