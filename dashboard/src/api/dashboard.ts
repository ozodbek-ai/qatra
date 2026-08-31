import { api } from "@/lib/axios";
import type { DashboardData } from "@/types/dashboard";

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get<{
    success: boolean;
    data: DashboardData;
  }>("/dashboard");

  return response.data.data;
};