import { prisma } from "../lib/prisma.js";
import type { CreateCourseInput } from "../validators/course.validator.js";
import type { Prisma } from "../generated/prisma/client";

export const createCourse = (data: CreateCourseInput) => {
  return prisma.course.create({
    data,
  });
};
export const findAllPublishedCourses = () => {
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
  },
  orderBy: {
    createdAt: "desc",
  },
});
};
export const findCourseBySlug = (slug: string) => {
  return prisma.course.findUnique({
    where: {
      slug,
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
export const deleteCourse = (id: string) => {
  return prisma.course.delete({
    where: {
      id,
    },
  });
};

export const findCourseForPublish = (
  courseId: string
) => {
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