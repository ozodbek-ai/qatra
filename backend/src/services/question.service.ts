import { prisma } from "../lib/prisma.js";
import * as questionRepository from "../repositories/question.repository.js";
import type { CreateQuestionInput } from "../validators/question.validator.js";
import { AppError } from "../utils/AppError.js";
import type { UpdateQuestionInput } from "../validators/question.validator.js";

export const createQuestion = async (
  data: CreateQuestionInput
) => {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: data.quizId,
    },
  });

  if (!quiz) {
    throw new AppError(
      "Quiz topilmadi.",
      404
    );
  }

  const correctAnswers =
    data.options.filter(
      (option) => option.isCorrect
    );

  if (correctAnswers.length !== 1) {
    throw new AppError(
      "Faqat bitta to'g'ri javob bo'lishi kerak.",
      400
    );
  }

  return questionRepository.createQuestion(data);
};
export const getQuestion = async (
  id: string
) => {

  const question =
    await questionRepository.findQuestionById(id);

  if (!question) {
    throw new AppError(
      "Savol topilmadi.",
      404
    );
  }

  return question;
};

export const getQuestionsByQuiz = async (
  quizId: string
) => {

  return questionRepository.findQuestionsByQuiz(
    quizId
  );
};

export const updateQuestion = async (
  id: string,
  data: UpdateQuestionInput
) => {

  const question =
    await questionRepository.findQuestionById(id);

  if (!question) {
    throw new AppError(
      "Savol topilmadi.",
      404
    );
  }

  return questionRepository.updateQuestion(
    id,
    data.question
  );
};

export const deleteQuestion = async (
  id: string
) => {

  const question =
    await questionRepository.findQuestionById(id);

  if (!question) {
    throw new AppError(
      "Savol topilmadi.",
      404
    );
  }

  await questionRepository.deleteQuestion(id);
};