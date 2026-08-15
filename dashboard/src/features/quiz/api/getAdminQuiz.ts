import { api } from "@/lib/axios";
import type { Quiz } from "../types/quiz";

export const getAdminQuiz = async (
  quizId: string
) => {
  const response = await api.get<{
    success: boolean;
    data: Quiz;
  }>(`/quizzes/admin/${quizId}`);

  return response.data.data;
};