import { api } from "@/lib/axios";

export interface CreateQuestionData {
  quizId: string;

  question: string;

  type: "SINGLE" | "MULTIPLE";

  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export const createQuestion = async (
  data: CreateQuestionData
) => {
  const response = await api.post(
    "/questions",
    data
  );

  return response.data.data;
};