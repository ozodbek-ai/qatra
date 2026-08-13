import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { SiteSettings } from "../types/settings";

export interface UpdateSettingsData {
  platformName: string;
  description: string;
  logoUrl?: string | null;
  supportEmail?: string | null;
  defaultQuizPassPercentage: number;
}

export async function updateSettings(
  data: UpdateSettingsData
) {
  const response =
    await api.put<ApiResponse<SiteSettings>>(
      "/settings",
      data
    );

  return response.data.data;
}