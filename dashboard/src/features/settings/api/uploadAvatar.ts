import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { UserProfile } from "./getProfile";

export async function uploadAvatar(file: File) {
  const formData = new FormData();

  formData.append("avatar", file);

  const response =
    await api.post<ApiResponse<UserProfile>>(
      "/upload/profile/avatar",
      formData
    );

  return response.data.data;
}