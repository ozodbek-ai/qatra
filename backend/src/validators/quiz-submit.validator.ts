import { z } from "zod";

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        optionIds: z
          .array(z.string())
          .min(1),
      })
    )
    .min(1),
});

export type SubmitQuizInput =
  z.infer<typeof submitQuizSchema>;