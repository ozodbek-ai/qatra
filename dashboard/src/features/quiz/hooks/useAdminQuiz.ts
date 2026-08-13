import { useQuery } from "@tanstack/react-query";

import { getAdminQuiz } from "../api/getAdminQuiz";

export function useAdminQuiz(
  quizId: string
) {
  return useQuery({
    queryKey: ["admin-quiz", quizId],
    queryFn: () => getAdminQuiz(quizId),
    enabled: !!quizId,
  });
}