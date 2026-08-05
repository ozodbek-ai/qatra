import { prisma } from "../lib/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";
import type { CreateLessonInput } from "../validators/lesson.validator.js";

export const createLesson = (
  data: CreateLessonInput
) => {
  return prisma.lesson.create({
    data,
  });
};

export const findLessonById = (
  id: string
) => {
  return prisma.lesson.findUnique({
    where: {
      id,
    },
  });
};

export const findLessonsByCourse = (
  courseId: string
) => {
  return prisma.lesson.findMany({
    where: {
      courseId,
      isPublished: true,
    },

    orderBy: {
      order: "asc",
    },

    include: {
      quiz: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const findLessonsByCourseOrdered = (
  courseId: string
) => {
  return prisma.lesson.findMany({
    where: {
      courseId,
    },

    orderBy: {
      order: "asc",
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

export const deleteLesson = (
  id: string
) => {
  return prisma.lesson.delete({
    where: {
      id,
    },
  });
};

export const countLessonsByCourse = (
  courseId: string
) => {
  return prisma.lesson.count({
    where: {
      courseId,
    },
  });
};