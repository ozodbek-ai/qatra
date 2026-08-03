import { prisma } from "../lib/prisma.js";

export const findCompletion = (
  userId: string,
  courseId: string
) => {
  return prisma.courseCompletion.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};

export const createCompletion = (
  userId: string,
  courseId: string
) => {
  return prisma.courseCompletion.create({
    data: {
      userId,
      courseId,
    },
  });
};

export const getCompletedCourses = (
  userId: string
) => {
  return prisma.courseCompletion.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
    orderBy: {
      completedAt: "desc",
    },
  });
};
export const getCourseQuizzes = (
  courseId: string
) => {
  return prisma.quiz.findMany({
    where: {
      lesson: {
        courseId,
      },
    },
    select: {
      id: true,
    },
  });
};
export const getPassedQuizCount = (
  userId: string,
  quizIds: string[]
) => {
  return prisma.quizAttempt.count({
    where: {
      userId,
      quizId: {
        in: quizIds,
      },
      passed: true,
    },
  });
};