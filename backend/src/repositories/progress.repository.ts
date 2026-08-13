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
export const getAllProgress = async (
  skip: number,
  take: number,
  search?: string
) => {
  const where = search
    ? {
        OR: [
          {
            user: {
              fullName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
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

  const [progress, total] =
    await prisma.$transaction([
      prisma.lessonProgress.findMany({
        where,

        skip,
        take,

        orderBy: {
          lastViewedAt: "desc",
        },

        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },

          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true,

              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      }),

      prisma.lessonProgress.count({
        where,
      }),
    ]);

  return {
    progress,
    total,
  };
};