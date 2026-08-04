import { z } from "zod";
export const submitQuizSchema = z.object({
    answers: z.array(z.object({
        questionId: z.string(),
        optionId: z.string(),
    })).min(1),
});
