import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role:
    | "STUDENT"
    | "ADMIN"
    | "SUPER_ADMIN";
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getProfile() {
  const response =
    await api.get<ApiResponse<UserProfile>>(
      "/user/profile"
    );

  return response.data.data;
}