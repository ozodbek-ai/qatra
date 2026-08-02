import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().positive(),
  order: z.number().int().positive(),
  isPreview: z.boolean().optional(),
  courseId: z.string().cuid(),
});

export const updateLessonSchema =
  createLessonSchema.partial();

export type CreateLessonInput =
  z.infer<typeof createLessonSchema>;