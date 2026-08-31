import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
) {
  const response =
    await api.post<
      ApiResponse<null>
    >(
      "/auth/forgot-password",
      data,
    );

  return response.data;
}