import { prisma } from "../lib/prisma.js";

export const getUserById = (
  userId: string
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });
};

export const getEnrollments = (
  userId: string
) => {
  return prisma.enrollment.findMany({
    where: {
      userId,
    },

    include: {
      course: {
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },

          completions: {
            where: {
              userId,
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

export const countCompletedLessons = (
  userId: string
) => {
  return prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
    },
  });
};

export const countCertificates = (
  userId: string
) => {
  return prisma.certificate.count({
    where: {
      userId,
    },
  });
};

export const getLastViewedLesson = (
  userId: string
) => {
  return prisma.lessonProgress.findFirst({
    where: {
      userId,
    },

    include: {
      lesson: {
        include: {
          course: true,
        },
      },
    },

    orderBy: {
      lastViewedAt: "desc",
    },
  });
};