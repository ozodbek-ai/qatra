import { api } from "@/lib/axios";

export interface MeResponse {
  userId: string;
  fullName: string;
  email: string;
  role:
    | "STUDENT"
    | "ADMIN"
    | "SUPER_ADMIN";
  avatarUrl: string | null;
}

export async function me(): Promise<MeResponse> {
  const response = await api.get<{
    success: boolean;
    data: MeResponse;
  }>("/auth/me");

  return response.data.data;
}