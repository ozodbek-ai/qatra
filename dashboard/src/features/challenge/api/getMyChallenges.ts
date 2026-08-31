import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";

import type {
  Challenge,
} from "../types/challenge.types";


export async function getMyChallenges() {
  const response =
    await api.get<ApiResponse<Challenge[]>>(
      "/challenges"
    );

  return response.data;
}