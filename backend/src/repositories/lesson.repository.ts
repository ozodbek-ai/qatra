import { prisma } from "../lib/prisma.js";
import type { CreateLessonInput } from "../validators/lesson.validator.js";
import type { Prisma } from "../generated/prisma/client";

export const createLesson = (data: CreateLessonInput) => {
  return prisma.lesson.create({
    data,
  });
};
export const findLessonsByCourse = (courseId: string) => {
  return prisma.lesson.findMany({
    where: {
      courseId,
    },
    orderBy: {
      order: "asc",
    },
  });
};
export const findLessonById = (id: string) => {
  return prisma.lesson.findUnique({
    where: {
      id,
    },
  });
};
export const updateLesson = (
  id: string,
  data: Prisma.LessonUpdateInput
) => {
  return prisma.lesson.update({
    where: {
      id,
    },
    data,
  });
};
export const deleteLesson = (id: string) => {
  return prisma.lesson.delete({
    where: {
      id,
    },
  });
};
export const findLessonsByCourseOrdered = (courseId: string) => {
  return prisma.lesson.findMany({
    where: {
      courseId,
    },
    orderBy: {
      order: "asc",
    },
  });
};