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