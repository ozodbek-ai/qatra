import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

interface MeResponse {
  userId: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  avatarUrl: string | null;
}

export async function me() {
  const response =
    await api.get<ApiResponse<MeResponse>>(
      "/auth/me"
    );

  return response.data;
}