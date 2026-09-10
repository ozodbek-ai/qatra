import { API_URL } from "@/constants/api";
import { getAccessToken } from "@/services/storage.service";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function getHeaders() {
  const token = await getAccessToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

export type ChallengeUser = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
};

export async function searchChallengeUsers(
  search: string
): Promise<ApiResponse<ChallengeUser[]>> {
  const trimmedSearch = search.trim();

  if (!trimmedSearch) {
    return {
      success: true,
      data: [],
    };
  }

  const response = await fetch(
    `${API_URL}/chat/users?search=${encodeURIComponent(
      trimmedSearch
    )}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Foydalanuvchilarni qidirishda xatolik yuz berdi."
    );
  }

  return result;
}