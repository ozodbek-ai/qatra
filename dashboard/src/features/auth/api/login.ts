import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

export async function login(
  data: LoginRequest
) {
  const response =
    await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );

  return response.data;
}