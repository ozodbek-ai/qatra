import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export async function register(
  data: RegisterRequest
) {
  const response =
    await api.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data
    );

  return response.data;
}