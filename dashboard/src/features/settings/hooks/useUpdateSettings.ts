import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  updateSettings,
  type UpdateSettingsData,
} from "../api/updateSettings";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: UpdateSettingsData
    ) => updateSettings(data),

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["settings"],
        data
      );

      toast.success(
        "Sozlamalar muvaffaqiyatli saqlandi."
      );
    },

    onError: (error) => {
      console.error(
        "UPDATE SETTINGS ERROR:",
        error
      );

      toast.error(
        "Sozlamalarni saqlashda xatolik yuz berdi."
      );
    },
  });
}