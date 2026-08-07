import { api } from "@/lib/axios";

import type {
  SubmitAnswer,
  QuizResult,
} from "../types/quiz";

export const submitQuiz = async (
  quizId: string,
  answers: SubmitAnswer[]
) => {
  const response = await api.post<{
    success: boolean;
    data: QuizResult;
  }>(
    `/quizzes/${quizId}/submit`,
    {
      answers,
    }
  );

  return response.data.data;
};