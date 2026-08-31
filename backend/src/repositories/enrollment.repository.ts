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

          lessons: {
            where: {
              isPublished: true,
            },

            select: {
              id: true,

              progress: {
                where: {
                  userId,
                  completed: true,
                },

                select: {
                  id: true,
                },
              },
            },
          },

          reviews: {
  where: {
    userId,
  },
  select: {
    rating: true,
  },
},

          completions: {
            where: {
              userId,
            },

            select: {
              id: true,
              completedAt: true,
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

export const getAllEnrollments = async (
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
            course: {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      }
    : {};

  const [enrollments, total] =
    await prisma.$transaction([
      prisma.enrollment.findMany({
        where,

        skip,
        take,

        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },

          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              imageUrl: true,
            },
          },
        },

        orderBy: {
          enrolledAt: "desc",
        },
      }),

      prisma.enrollment.count({
        where,
      }),
    ]);

  return {
    enrollments,
    total,
  };
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