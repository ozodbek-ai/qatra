import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AdminDashboardResponse } from "../types/admin-dashboard";

export async function getAdminDashboard() {
  const response =
    await api.get<ApiResponse<AdminDashboardResponse>>(
      "/admin/dashboard"
    );

  return response.data.data;
}