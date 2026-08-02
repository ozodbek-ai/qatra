import { prisma } from "../lib/prisma.js";
import type { CreateLessonInput } from "../validators/lesson.validator.js";

export const createLesson = (data: CreateLessonInput) => {
  return prisma.lesson.create({
    data,
  });
};