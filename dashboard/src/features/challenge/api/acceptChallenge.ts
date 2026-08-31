import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";

import type {
  Challenge,
} from "../types/challenge.types";


export async function acceptChallenge(
  challengeId: string
) {
  const response =
    await api.patch<
      ApiResponse<Challenge>
    >(
      `/challenges/${challengeId}/accept`
    );

  return response.data;
}