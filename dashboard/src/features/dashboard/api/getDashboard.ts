import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { DashboardResponse } from "../types/dashboard";

export async function getDashboard() {
  const response =
    await api.get<ApiResponse<DashboardResponse>>(
      "/dashboard"
    );

  return response.data.data;
}