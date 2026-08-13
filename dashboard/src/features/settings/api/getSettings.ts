import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { SiteSettings } from "../types/settings";

export async function getSettings() {
  const response =
    await api.get<ApiResponse<SiteSettings>>(
      "/settings"
    );

  return response.data.data;
}