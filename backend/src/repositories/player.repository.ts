import { prisma } from "../lib/prisma.js";

export const findCourseWithLessons = (
  courseId: string
) => {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
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