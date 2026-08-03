import { prisma } from "../lib/prisma.js";

export const createEnrollment = (userId: string, courseId: string) => {
  return prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });
};

export const findEnrollment = (
  userId: string,
  courseId: string
) => {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};

export const getUserEnrollments = (userId: string) => {
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
export const hasEnrollment = (
  userId: string,
  courseId: string
) => {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};