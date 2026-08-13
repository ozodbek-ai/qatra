import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { AdminReview } from "../types/review";

export async function getAdminReviews() {
  const response =
    await api.get<ApiResponse<AdminReview[]>>(
      "/reviews/admin/all"
    );

  return response.data.data;
}