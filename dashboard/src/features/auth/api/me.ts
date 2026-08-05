import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

interface MeResponse {
  userId: string;
  email: string;
  role: string;
}

export async function me() {
  const response =
    await api.get<ApiResponse<MeResponse>>(
      "/auth/me"
    );

  return response.data;
}