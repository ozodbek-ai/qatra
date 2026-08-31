import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";


export async function deleteChallenge(
  challengeId: string
) {
  const response =
    await api.delete<
      ApiResponse<null>
    >(
      `/challenges/${challengeId}`
    );

  return response.data;
}