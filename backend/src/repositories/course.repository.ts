import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { CreateCourseInput } from "../validators/course.validator.js";

export const createCourse = (
  data: CreateCourseInput
) => {
  return prisma.course.create({
    data,
  });
};

export const findCourseById = (
  id: string
) => {
  return prisma.course.findUnique({
    where: {
      id,
    },
  });
};

export const findCourseBySlug = (
  slug: string
) => {
  return prisma.course.findUnique({
    where: {
      slug,
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

      reviews: {
        include: {
          user: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      },

      _count: {
        select: {
          lessons: true,
          enrollments: true,
          reviews: true,
        },
      },
    },
  });
};

export const findCourseByTitle = (
  title: string
) => {
  return prisma.course.findFirst({
    where: {
      title,
    },
  });
};

export const findAllPublishedCourses =
  () => {
    return prisma.course.findMany({
      where: {
        isPublished: true,
      },

      include: {
        reviews: {
          select: {
            rating: true,
          },
        },

        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const findAllCourses = () => {
  return prisma.course.findMany({
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },

      _count: {
        select: {
          enrollments: true,
          lessons: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateCourse = (
  id: string,
  data: Prisma.CourseUpdateInput
) => {
  return prisma.course.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCourse = (
  id: string
) => {
  return prisma.course.delete({
    where: {
      id,
    },
  });
};

export const findCourseForPublish =
  (courseId: string) => {
    return prisma.course.findUnique({
      where: {
        id: courseId,
      },

      include: {
        lessons: {
          include: {
            quiz: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });
  };

export const updatePublishStatus = (
  courseId: string,
  isPublished: boolean
) => {
  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      isPublished,
    },
  });
};

export const countPublishedCourses =
  () => {
    return prisma.course.count({
      where: {
        isPublished: true,
      },
    });
  };

export const countAllCourses =
  () => {
    return prisma.course.count();
  };
export const findPublishedCourseById = (
  id: string
) => {
  return prisma.course.findFirst({
    where: {
      id,
      isPublished: true,
    },
  });
};
