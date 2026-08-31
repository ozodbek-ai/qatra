import { api } from "@/lib/axios";

import type { User } from "@/types/auth";

export type AdminUserRole =
  User["role"];

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;

  role:
    | "STUDENT"
    | "ADMIN"
    | "SUPER_ADMIN";

  avatarUrl: string | null;

  isActive: boolean;

  emailVerified: boolean;

  enrolledCourses: number;

  certificates: number;

  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAdminUsers = async (
  page = 1,
  limit = 20
): Promise<AdminUsersResponse> => {
  const response = await api.get<{
    success: boolean;
    data: AdminUsersResponse;
  }>("/admin/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
};