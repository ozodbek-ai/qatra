import { prisma } from "../lib/prisma.js";
import type {
  CreateOptionInput,
  UpdateOptionInput,
} from "../validators/option.validator.js";

export const createOption = (
  data: CreateOptionInput
) => {
  return prisma.option.create({
    data,
  });
};

export const findOptionById = (
  id: string
) => {
  return prisma.option.findUnique({
    where: {
      id,
    },
  });
};

export const findOptionsByQuestion = (
  questionId: string
) => {
  return prisma.option.findMany({
    where: {
      questionId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const clearCorrectOption = (
  questionId: string
) => {
  return prisma.option.updateMany({
    where: {
      questionId,
      isCorrect: true,
    },
    data: {
      isCorrect: false,
    },
  });
};

export const updateOption = (
  id: string,
  data: UpdateOptionInput
) => {
  return prisma.option.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteOption = (
  id: string
) => {
  return prisma.option.delete({
    where: {
      id,
    },
  });
};