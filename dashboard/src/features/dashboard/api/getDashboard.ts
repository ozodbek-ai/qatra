import { api } from "@/lib/api";

import type { DashboardResponse } from "../types/dashboard";

export const getDashboard = async () => {
  const response =
    await api.get<{
      success: boolean;
      data: DashboardResponse;
    }>("/dashboard");

  return response.data.data;
};