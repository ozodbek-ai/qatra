import { useQuery } from "@tanstack/react-query";

import { getQuiz } from "../api/getQuiz";

export const useQuiz = (
  quizId: string
) => {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuiz(quizId),
    enabled: !!quizId,
  });
};