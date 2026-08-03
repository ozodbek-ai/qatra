import { z } from "zod";

export const createQuestionSchema = z.object({
  quizId: z.string().min(1),

  question: z.string().min(3),

  options: z
    .array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean(),
      })
    )
    .min(2)
    .max(6),
});
export const updateQuestionSchema = z.object({
  question: z.string().min(3),
});

export type CreateQuestionInput = z.infer<
  typeof createQuestionSchema
>;
export type UpdateQuestionInput =
  z.infer<typeof updateQuestionSchema>;