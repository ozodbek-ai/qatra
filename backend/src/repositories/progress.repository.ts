import { prisma } from "../lib/prisma.js";

export const findProgress = (
  userId: string,
  lessonId: string
) => {
  return prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });
};

export const createProgress = (
  userId: string,
  lessonId: string
) => {
  return prisma.lessonProgress.create({
    data: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });
};

export const updateProgress = (
  userId: string,
  lessonId: string
) => {
  return prisma.lessonProgress.update({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });
};
export const countCompletedLessons = (
  userId: string,
  lessonIds: string[]
) => {
  return prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: {
        in: lessonIds,
      },
      completed: true,
    },
  });
};
export const getCompletedLessonIds = (
  userId: string,
  lessonIds: string[]
) => {
  return prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: {
        in: lessonIds,
      },
      completed: true,
    },
    select: {
      lessonId: true,
    },
  });
};