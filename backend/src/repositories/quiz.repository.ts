import { prisma } from "../lib/prisma.js";
import type { CreateQuizInput } from "../validators/quiz.validator.js";

export const createQuiz = (
  data: CreateQuizInput
) => {
  return prisma.quiz.create({
    data,
  });
};

export const findQuizByLesson = (
  lessonId: string
) => {
  return prisma.quiz.findUnique({
    where: {
      lessonId,
    },
  });
};

export const findQuizWithQuestions = (
  quizId: string
) => {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
};

export const createQuizAttempt = (
  userId: string,
  quizId: string,
  score: number,
  total: number,
  percentage: number,
  passed: boolean
) => {
  return prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      total,
      percentage,
      passed,
    },
  });
};
export const findQuizAttempt = (
  userId: string,
  quizId: string
) => {
  return prisma.quizAttempt.findFirst({
    where: {
      userId,
      quizId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};