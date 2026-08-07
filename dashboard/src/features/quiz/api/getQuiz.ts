import { api } from "@/lib/axios";
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