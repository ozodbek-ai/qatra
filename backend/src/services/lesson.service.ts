import { AppError } from "../utils/AppError.js";
import * as lessonRepository from "../repositories/lesson.repository.js";
import { prisma } from "../lib/prisma.js";
import type { CreateLessonInput } from "../validators/lesson.validator.js";

export const createLesson = async (
  data: CreateLessonInput
) => {
  const course = await prisma.course.findUnique({
    where: {
      id: data.courseId,
    },
  });

  if (!course) {
    throw new AppError("Kurs topilmadi.", 404);
  }

  return lessonRepository.createLesson(data);
};