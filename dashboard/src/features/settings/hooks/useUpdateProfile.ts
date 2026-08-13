import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateProfile } from "../api/updateProfile";

export function useUpdateProfile() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-profile"],
        data
      );

      toast.success(
        "Profil muvaffaqiyatli yangilandi."
      );
    },

    onError: () => {
      toast.error(
        "Profilni yangilashda xatolik yuz berdi."
      );
    },
  });
}