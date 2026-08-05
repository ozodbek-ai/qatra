import { prisma } from "../lib/prisma.js";

export const createEnrollment = (
  userId: string,
  courseId: string
) => {
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

export const findEnrollmentById = (
  id: string
) => {
  return prisma.enrollment.findUnique({
    where: {
      id,
    },
  });
};

export const getUserEnrollments = (
  userId: string
) => {
  return prisma.enrollment.findMany({
    where: {
      userId,
    },

    include: {
      course: {
        include: {
          _count: {
            select: {
              lessons: true,
            },
          },

          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },

    orderBy: {
      enrolledAt: "desc",
    },
  });
};

export const deleteEnrollment = (
  id: string
) => {
  return prisma.enrollment.delete({
    where: {
      id,
    },
  });
};

export const countEnrollments = () => {
  return prisma.enrollment.count();
};
export const findEnrollmentByUserAndCourse = (
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
