import { z } from "zod";
export const createLessonSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Dars nomi kamida 3 ta belgidan iborat bo'lishi kerak.")
        .max(150, "Dars nomi 150 ta belgidan oshmasligi kerak."),
    description: z
        .string()
        .trim()
        .max(5000)
        .optional(),
    videoUrl: z
        .string()
        .url("Video URL noto'g'ri.")
        .optional(),
    duration: z
        .number()
        .int()
        .positive(),
    order: z
        .number()
        .int()
        .positive(),
    isPreview: z
        .boolean()
        .optional(),
    courseId: z
        .string()
        .cuid({
        message: "Course ID noto'g'ri.",
    }),
});
export const updateLessonSchema = createLessonSchema.partial();
export const lessonIdSchema = z.object({
    id: z.string().cuid({
        message: "Lesson ID noto'g'ri.",
    }),
});
