import { prisma } from "../lib/prisma.js";

export const findStudents = (
  skip: number,
  take: number,
  search?: string
) => {
  return prisma.user.findMany({
    where: {
      role: "STUDENT",

      ...(search
        ? {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    skip,
    take,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      isActive: true,
      lastLoginAt: true,

      _count: {
        select: {
          enrollments: true,
          quizAttempts: true,
          lessonProgress: true,
          courseCompletions: true,
          certificates: true,
          reviews: true,
        },
      },
    },
  });
};

export const findStudentById = (
  id: string
) => {
  return prisma.user.findUnique({
    where: {
      id,
    },

    include: {
      enrollments: {
        include: {
          course: true,
        },

        orderBy: {
          enrolledAt: "desc",
        },
      },

      lessonProgress: {
        include: {
          lesson: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },

        orderBy: {
          lastViewedAt: "desc",
        },
      },

      quizAttempts: {
        include: {
          quiz: {
            select: {
              id: true,
              title: true,

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
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      courseCompletions: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              imageUrl: true,
            },
          },

          certificate: {
            select: {
              id: true,
              certificateNo: true,
              issuedAt: true,
            },
          },
        },

        orderBy: {
          completedAt: "desc",
        },
      },

      certificates: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },

        orderBy: {
          issuedAt: "desc",
        },
      },

      reviews: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const countStudents = (
  search?: string
) => {
  return prisma.user.count({
    where: {
      role: "STUDENT",

      ...(search
        ? {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
  });
};
export const countTotalLessonsForStudent = (
  userId: string
) => {
  return prisma.lesson.count({
    where: {
      isPublished: true,

      course: {
        enrollments: {
          some: {
            userId,
          },
        },
      },
    },
  });
};