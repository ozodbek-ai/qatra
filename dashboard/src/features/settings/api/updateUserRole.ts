import { api } from "@/lib/axios";

export type UpdateUserRole =
  | "ADMIN"
  | "STUDENT";

export const updateUserRole = async (
  userId: string,
  role: UpdateUserRole
) => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: unknown;
  }>(
    `/admin/users/${userId}/role`,
    {
      role,
    }
  );

  return response.data;
};