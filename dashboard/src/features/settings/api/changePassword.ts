import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  const response =
    await api.put<ApiResponse<null>>(
      "/user/password",
      {
        currentPassword,
        newPassword,
        confirmPassword,
      }
    );

  return response.data;
}