import { z } from "zod";
export const createQuizSchema = z.object({
    lessonId: z.string().min(1, "Lesson ID kerak."),
    title: z
        .string()
        .trim()
        .min(3, "Quiz nomi kamida 3 ta belgidan iborat bo'lishi kerak.")
        .max(150, "Quiz nomi 150 ta belgidan oshmasligi kerak."),
    description: z
        .string()
        .trim()
        .max(5000, "Quiz tavsifi 5000 ta belgidan oshmasligi kerak.")
        .optional(),
    passPercentage: z
        .number()
        .int()
        .min(1)
        .max(100),
});
