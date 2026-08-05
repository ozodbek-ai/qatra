import { z } from "zod";

export const enrollmentSchema = z.object({
  courseId: z.string().cuid({
    message: "Course ID noto'g'ri.",
  }),
});

export const enrollmentIdSchema = z.object({
  id: z.string().cuid({
    message: "Enrollment ID noto'g'ri.",
  }),
});

export type EnrollmentInput =
  z.infer<typeof enrollmentSchema>;