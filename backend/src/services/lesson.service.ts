import { AppError } from "../utils/AppError.js";
import * as lessonRepository from "../repositories/lesson.repository.js";
import { prisma } from "../lib/prisma.js";
import type { CreateLessonInput } from "../validators/lesson.validator.js";
import type { Prisma } from "../generated/prisma/client";

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
export const getLessonsByCourse = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new AppError("Kurs topilmadi.", 404);
  }

  return lessonRepository.findLessonsByCourse(courseId);
};
export const getLessonById = async (id: string) => {
  const lesson = await lessonRepository.findLessonById(id);

  if (!lesson) {
    throw new AppError("Dars topilmadi.", 404);
  }

  return lesson;
};
export const updateLesson = async (
  id: string,
  data: Prisma.LessonUpdateInput
) => {
  const lesson = await lessonRepository.findLessonById(id);

  if (!lesson) {
    throw new AppError("Dars topilmadi.", 404);
  }

  return lessonRepository.updateLesson(id, data);
};
export const deleteLesson = async (id: string) => {
  const lesson = await lessonRepository.findLessonById(id);

  if (!lesson) {
    throw new AppError("Dars topilmadi.", 404);
  }

  await lessonRepository.deleteLesson(id);
};