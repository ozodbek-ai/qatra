import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { UserProfile } from "./getProfile";

export async function updateProfile(
  fullName: string
) {
  const response =
    await api.put<ApiResponse<UserProfile>>(
      "/user/profile",
      {
        fullName,
      }
    );

  return response.data.data;
}