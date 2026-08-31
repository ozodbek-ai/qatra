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
            where: {
              isPublished: true,
            },

            orderBy: {
              order: "asc",
            },

            include: {
              progress: {
                where: {
                  userId,
                  completed: true,
                },

                select: {
                  id: true,
                  completed: true,
                  completedAt: true,
                },
              },
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

/*
 * Foydalanuvchining oxirgi ko'rgan,
 * lekin hali yakunlamagan darsini topadi.
 */
export const getLastViewedLesson = (
  userId: string
) => {
  return prisma.lessonProgress.findFirst({
    where: {
      userId,
      completed: false,
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

export const getNextLessonForCourse = async (
  userId: string,
  courseId: string
) => {
  const lessons =
    await prisma.lesson.findMany({
      where: {
        courseId,
        isPublished: true,
      },

      orderBy: {
        order: "asc",
      },

      select: {
        id: true,
        title: true,
        order: true,
      },
    });

  if (lessons.length === 0) {
    return null;
  }

  const completedLessons =
    await prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: {
          in: lessons.map(
            (lesson) => lesson.id
          ),
        },
        completed: true,
      },

      select: {
        lessonId: true,
      },
    });

  const completedIds = new Set(
    completedLessons.map(
      (item) => item.lessonId
    )
  );

  return (
    lessons.find(
      (lesson) =>
        !completedIds.has(lesson.id)
    ) ?? null
  );
};

export const countCompletedLessonsForCourse = (
  userId: string,
  courseId: string
) => {
  return prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
      lesson: {
        courseId,
        isPublished: true,
      },
    },
  });
};

/*
 * Dashboard uchun tavsiya qilinadigan kurslar.
 *
 * Faqat:
 * - published
 * - active
 * - student hali yozilmagan
 * kurslar olinadi.
 *
 * Eng yangi kurslar birinchi chiqadi.
 */
export const getRecommendedCourses = async (
  userId: string,
  limit = 6
) => {
  const courses =
    await prisma.course.findMany({
      where: {
        isPublished: true,
        isActive: true,

        enrollments: {
          none: {
            userId,
          },
        },
      },

      include: {
        lessons: {
          where: {
            isPublished: true,
          },

          select: {
            id: true,
          },
        },

        reviews: {
          select: {
            rating: true,
          },
        },

        _count: {
          select: {
            enrollments: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,
    });

  return courses.map((course) => {
    const ratings =
      course.reviews.map(
        (review) => review.rating
      );

    const averageRating =
      ratings.length === 0
        ? 0
        : Math.round(
            (ratings.reduce(
              (sum, rating) =>
                sum + rating,
              0
            ) /
              ratings.length) *
              10
          ) / 10;

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category,
      price: course.price,
      duration: course.duration,
      level: course.level,

      totalLessons:
        course.lessons.length,

      averageRating,

      enrollmentCount:
        course._count.enrollments,
    };
  });
};