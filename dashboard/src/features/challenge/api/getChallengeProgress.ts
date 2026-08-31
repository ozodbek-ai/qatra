import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";

import type {
  Challenge,
} from "../types/challenge.types";


export async function getChallengeProgress(
  challengeId: string
) {
  const response =
    await api.get<
      ApiResponse<Challenge>
    >(
      `/challenges/${challengeId}/progress`
    );

  return response.data;
}