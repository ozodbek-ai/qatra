import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export async function resetPassword(
  data: ResetPasswordRequest,
) {
  const response =
    await api.post<
      ApiResponse<null>
    >(
      "/auth/reset-password",
      data,
    );

  return response.data;
}