import { z } from "zod";

export const createOptionSchema = z.object({
  questionId: z.string().min(1),

  text: z.string().min(1),

  isCorrect: z.boolean(),
});

export const updateOptionSchema = z.object({
  text: z.string().min(1),

  isCorrect: z.boolean(),
});

export type CreateOptionInput =
  z.infer<typeof createOptionSchema>;

export type UpdateOptionInput =
  z.infer<typeof updateOptionSchema>;