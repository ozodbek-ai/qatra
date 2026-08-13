import { useMutation } from "@tanstack/react-query";

import {
  createQuiz,
  type CreateQuizData,
} from "../api/createQuiz";

export function useCreateQuiz() {
  return useMutation({
    mutationFn: (data: CreateQuizData) =>
      createQuiz(data),
  });
}