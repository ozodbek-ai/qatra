import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import * as courseRepository from "../repositories/course.repository.js";
import type { CreateCourseInput } from "../validators/course.validator.js";
import type { Prisma } from "../generated/prisma/client";

export const getCourses = async () => {
  return prisma.course.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createCourse = async (data: CreateCourseInput) => {
  return courseRepository.createCourse(data);
};

export const getAllCourses = () => {
  return courseRepository.findAllPublishedCourses();
};

export const getCourseBySlug = async (slug: string) => {
  const course = await courseRepository.findCourseBySlug(slug);

  if (!course) {
    throw new AppError("Kurs topilmadi.", 404);
  }

  return course;
};
export const updateCourse = async (
  id: string,
  data: Prisma.CourseUpdateInput
) => {
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    throw new AppError("Kurs topilmadi.", 404);
  }

  return courseRepository.updateCourse(id, data);
};
export const deleteCourse = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new AppError("Kurs topilmadi.", 404);
  }

  await courseRepository.deleteCourse(id);
};