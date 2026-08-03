import { z } from "zod";

export const createQuizSchema = z.object({
  lessonId: z.string().min(1),
});

export type CreateQuizInput = z.infer<
  typeof createQuizSchema
>;