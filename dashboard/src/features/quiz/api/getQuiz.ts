import { api } from "@/lib/api";
import type { Quiz } from "../types/quiz";

export const getQuiz = async (
  quizId: string
) => {
  const response = await api.get<{
    success: boolean;
    data: Quiz;
  }>(`/quizzes/${quizId}`);

  return response.data.data;
};