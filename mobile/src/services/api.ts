import { API_URL } from "@/constants/api";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
  } = options;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      },

      ...(body
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
      "Serverda xatolik yuz berdi."
    );
  }

  return data;
}