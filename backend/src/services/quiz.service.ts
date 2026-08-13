import * as quizRepository from "../repositories/quiz.repository.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import * as courseCompletionService from "./course-completion.service.js";

import type { CreateQuizInput } from "../validators/quiz.validator.js";
import type { SubmitQuizInput } from "../validators/quiz-submit.validator.js";
import {
  getPagination,
  type PaginationQuery,
} from "../utils/pagination.js";

export const createQuiz = async (
  data: CreateQuizInput
) => {
  console.log("================================");
  console.log("CREATE QUIZ REQUEST");
  console.log("Data:", data);

  const lesson =
    await prisma.lesson.findUnique({
      where: {
        id: data.lessonId,
      },
    });

  if (!lesson) {
    throw new AppError(
      "Dars topilmadi.",
      404
    );
  }

  const existingQuiz =
    await quizRepository.findQuizByLesson(
      data.lessonId
    );

  if (existingQuiz) {
    throw new AppError(
      "Bu dars uchun quiz allaqachon mavjud.",
      400
    );
  }

  const quiz =
    await quizRepository.createQuiz(data);

  console.log(
    "✅ QUIZ CREATED"
  );

  console.log(
    "Created quiz ID:",
    quiz.id
  );

  console.log(
    "Lesson ID:",
    quiz.lessonId
  );

  console.log(
    "Title:",
    quiz.title
  );

  console.log("================================");

  return quiz;
};


export const submitQuiz = async (
  userId: string,
  quizId: string,
  data: SubmitQuizInput
) => {
  const quiz =
    await quizRepository.findQuizWithQuestions(
      quizId
    );

  if (!quiz) {
    throw new AppError(
      "Quiz topilmadi.",
      404
    );
  }

  const existingAttempt =
  await quizRepository.findQuizAttempt(
    userId,
    quizId
  );

if (existingAttempt?.passed) {
  throw new AppError(
    "Siz bu quizni allaqachon muvaffaqiyatli topshirgansiz.",
    400
  );
}

  let score = 0;

  for (const question of quiz.questions) {
    const answer = data.answers.find(
      (item) =>
        item.questionId === question.id
    );

    if (!answer) {
      continue;
    }

    const selectedOptionIds =
      [...answer.optionIds].sort();

    const correctOptionIds =
      question.options
        .filter(
          (option) => option.isCorrect
        )
        .map(
          (option) => option.id
        )
        .sort();

    if (
      selectedOptionIds.length !==
      correctOptionIds.length
    ) {
      continue;
    }

    const isCorrect =
      selectedOptionIds.every(
        (id, index) =>
          id === correctOptionIds[index]
      );

    if (isCorrect) {
      score++;
    }
  }

  const total =
    quiz.questions.length;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (score / total) * 100
        );

  const passed =
    percentage >=
    quiz.passPercentage;

  await quizRepository.createQuizAttempt(
  userId,
  quizId,
  score,
  total,
  percentage,
  passed
);

// Quiz muvaffaqiyatli topshirilgan bo'lsa,
// kurs tugaganligini tekshiramiz.
if (passed) {
  const quizWithLesson =
    await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        lesson: {
          select: {
            courseId: true,
          },
        },
      },
    });

  if (quizWithLesson?.lesson.courseId) {
    await courseCompletionService.checkCourseCompletion(
      userId,
      quizWithLesson.lesson.courseId
    );
  }
}

return {
  score,
  total,
  percentage,
  passed,
};
};


export const getQuizResult = async (
  userId: string,
  quizId: string
) => {
  const attempt =
    await quizRepository.findQuizAttempt(
      userId,
      quizId
    );

  if (!attempt) {
    throw new AppError(
      "Quiz hali topshirilmagan.",
      404
    );
  }

  return {
    score: attempt.score,
    total: attempt.total,
    percentage: attempt.percentage,
    passed: attempt.passed,
    submittedAt:
      attempt.createdAt,
  };
};


export const getQuiz = async (
  quizId: string
) => {
  console.log(
    "================================"
  );

  console.log(
    "GET QUIZ REQUEST"
  );

  console.log(
    "quizId:",
    quizId
  );

  const quiz =
    await quizRepository.findQuizById(
      quizId
    );

  console.log(
    "Quiz found:",
    Boolean(quiz)
  );

  if (!quiz) {
    console.log(
      "❌ QUIZ NOT FOUND IN DATABASE:",
      quizId
    );

    throw new AppError(
      "Quiz topilmadi.",
      404
    );
  }

  console.log(
    "✅ QUIZ FOUND:",
    quiz.id
  );

  console.log(
    "Questions:",
    quiz.questions.length
  );

  console.log(
    "================================"
  );

  return quiz;
};

export const getAllQuizzes = async (
  query: PaginationQuery
) => {
  const {
    page,
    limit,
    skip,
    take,
  } = getPagination(query);

  const search =
    query.search?.trim();

  const result =
    await quizRepository.getAllQuizzes(
      skip,
      take,
      search
    );

  return {
    items: result.quizzes.map(
      (quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        passPercentage:
          quiz.passPercentage,

        lesson: {
          id: quiz.lesson.id,
          title: quiz.lesson.title,
        },

        course: {
          id: quiz.lesson.course.id,
          title:
            quiz.lesson.course.title,
        },

        questionsCount:
          quiz._count.questions,

        attemptsCount:
          quiz._count.attempts,

        createdAt:
          quiz.createdAt,
      })
    ),

    pagination: {
      page,
      limit,
      total: result.total,
      totalPages:
        Math.ceil(
          result.total / limit
        ),
    },
  };
};