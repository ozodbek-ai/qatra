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

// Submit uchun ishlatiladi.
// Bu yerda tartibni o'zgartirmaymiz.
export const findQuizWithQuestions = (
  quizId: string
) => {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },

    include: {
      lesson: {
        select: {
          id: true,
          courseId: true,
        },
      },

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

// Studentga quizni ko'rsatish uchun
export const findQuizById = (
  quizId: string
) => {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },

    include: {
      lesson: {
        select: {
          id: true,
          title: true,

          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },

      questions: {
        include: {
          options: {
            select: {
              id: true,
              text: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};
export const getAllQuizzes = async (
  skip: number,
  take: number,
  search?: string
) => {
  const where = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            lesson: {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            lesson: {
              course: {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
          },
        ],
      }
    : {};

  const [quizzes, total] =
    await prisma.$transaction([
      prisma.quiz.findMany({
        where,

        skip,
        take,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          lesson: {
            select: {
              id: true,
              title: true,

              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },

          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      }),

      prisma.quiz.count({
        where,
      }),
    ]);

  return {
    quizzes,
    total,
  };
};
export const findAdminQuizById = (
  quizId: string
) => {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },

    include: {
      lesson: {
        select: {
          id: true,
          title: true,

          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },

      questions: {
        include: {
          options: {
            select: {
              id: true,
              text: true,
              isCorrect: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};