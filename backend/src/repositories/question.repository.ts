import { prisma } from "../lib/prisma.js";
import type { CreateQuestionInput } from "../validators/question.validator.js";

export const createQuestion = (
  data: CreateQuestionInput
) => {
  return prisma.question.create({
    data: {
      quizId: data.quizId,
      question: data.question,
      options: {
        create: data.options,
      },
    },
    include: {
      options: true,
    },
  });
};

export const findQuestionById = (
  id: string
) => {
  return prisma.question.findUnique({
    where: {
      id,
    },
    include: {
      options: true,
    },
  });
};

export const findQuestionsByQuiz = (
  quizId: string
) => {
  return prisma.question.findMany({
    where: {
      quizId,
    },
    include: {
      options: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const updateQuestion = (
  id: string,
  question: string
) => {
  return prisma.question.update({
    where: {
      id,
    },
    data: {
      question,
    },
    include: {
      options: true,
    },
  });
};

export const deleteQuestion = (
  id: string
) => {
  return prisma.question.delete({
    where: {
      id,
    },
  });
};