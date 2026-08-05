import { useMutation } from "@tanstack/react-query";

import { submitQuiz } from "../api/submitQuiz";

import type { SubmitAnswer } from "../types/quiz";

export const useSubmitQuiz = (
  quizId: string
) => {
  return useMutation({
    mutationFn: (
      answers: SubmitAnswer[]
    ) =>
      submitQuiz(
        quizId,
        answers
      ),
  });
};