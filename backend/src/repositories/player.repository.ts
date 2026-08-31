import { prisma } from "../lib/prisma.js";

export const findCourseWithLessons = (
  courseId: string
) => {
  return prisma.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },

    include: {
      lessons: {
        where: {
          isPublished: true,
        },

        orderBy: {
          order: "asc",
        },

        include: {
          quiz: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export const findCompletedLessons = (
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

export const findLastViewedLesson = (
  userId: string,
  lessonIds: string[]
) => {
  return prisma.lessonProgress.findFirst({
    where: {
      userId,
      lessonId: {
        in: lessonIds,
      },
    },

    orderBy: {
      lastViewedAt: "desc",
    },

    select: {
      lessonId: true,
      completed: true,
      lastViewedAt: true,
    },
  });
};

export const updateLastViewedLesson = async (
  userId: string,
  lessonId: string
) => {
  return prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },

    update: {
      lastViewedAt: new Date(),
    },

    create: {
      userId,
      lessonId,
      completed: false,
      lastViewedAt: new Date(),
    },
  });
};