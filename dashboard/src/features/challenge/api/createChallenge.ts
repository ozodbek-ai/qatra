import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";

import type {
  Challenge,
  CreateChallengePayload,
} from "../types/challenge.types";


export async function createChallenge(
  data: CreateChallengePayload
) {
  const response =
    await api.post<
      ApiResponse<Challenge>
    >(
      "/challenges",
      data
    );

  return response.data;
}