import { api } from "@/lib/axios";
import type { Quiz } from "../types/quiz";

export interface CreateQuizData {
  lessonId: string;
  title: string;
  description?: string;
  passPercentage: number;
}

export const createQuiz = async (
  data: CreateQuizData
) => {
  console.log("CREATE QUIZ DATA:", data);

  const response = await api.post<{
    success: boolean;
    data: Quiz;
  }>("/quizzes", data);

  return response.data.data;
};