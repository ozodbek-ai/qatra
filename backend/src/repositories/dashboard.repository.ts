import { prisma } from "../lib/prisma.js";

export const getUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });
};

export const getEnrollments = (userId: string) => {
  return prisma.enrollment.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });
};

export const countCompletedLessons = (userId: string) => {
  return prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
    },
  });
};