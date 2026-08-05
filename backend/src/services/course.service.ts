import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

import * as courseRepository from "../repositories/course.repository.js";

import type {
  CreateCourseInput,
  PublishCourseInput,
} from "../validators/course.validator.js";

import type { Prisma } from "../generated/prisma/client.js";

export const getCourses = () => {
  return courseRepository.findAllPublishedCourses();
};

export const createCourse = async (
  data: CreateCourseInput
) => {
  const existingSlug =
    await courseRepository.findCourseBySlug(
      data.slug
    );

  if (existingSlug) {
    throw new AppError(
      "Bu slug allaqachon mavjud.",
      409
    );
  }

  const existingTitle =
    await courseRepository.findCourseByTitle(
      data.title
    );

  if (existingTitle) {
    throw new AppError(
      "Bu nomdagi kurs allaqachon mavjud.",
      409
    );
  }

  const course =
    await courseRepository.createCourse(data);

  logger.info({
    message: "Course created",
    courseId: course.id,
    title: course.title,
  });

  return course;
};

export const getCourseBySlug = async (
  slug: string
) => {
  const course =
    await courseRepository.findCourseBySlug(
      slug
    );

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  return course;
};

export const updateCourse = async (
  id: string,
  data: Prisma.CourseUpdateInput
) => {
  const course =
    await courseRepository.findCourseById(id);

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  const updatedCourse =
    await courseRepository.updateCourse(
      id,
      data
    );

  logger.info({
    message: "Course updated",
    courseId: id,
  });

  return updatedCourse;
};

export const deleteCourse = async (
  id: string
) => {
  const course =
    await courseRepository.findCourseById(id);

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  await courseRepository.deleteCourse(id);

  logger.info({
    message: "Course deleted",
    courseId: id,
  });
};

export const publishCourse = async (
  courseId: string,
  data: PublishCourseInput
) => {
  const course =
    await courseRepository.findCourseForPublish(
      courseId
    );

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  if (!data.isPublished) {
    return courseRepository.updatePublishStatus(
      courseId,
      false
    );
  }

  if (course.lessons.length === 0) {
    throw new AppError(
      "Kursda kamida bitta dars bo'lishi kerak.",
      400
    );
  }

  for (const lesson of course.lessons) {
    if (!lesson.videoUrl) {
      throw new AppError(
        `"${lesson.title}" darsida video mavjud emas.`,
        400
      );
    }
  }

  const quizzes = course.lessons
    .map((lesson) => lesson.quiz)
    .filter((quiz) => quiz !== null);

  if (quizzes.length === 0) {
    throw new AppError(
      "Kursda kamida bitta quiz bo'lishi kerak.",
      400
    );
  }

  for (const quiz of quizzes) {
    if (quiz.questions.length === 0) {
      throw new AppError(
        "Quizda kamida bitta savol bo'lishi kerak.",
        400
      );
    }
  }

  const publishedCourse =
    await courseRepository.updatePublishStatus(
      courseId,
      true
    );

  logger.info({
    message: "Course published",
    courseId,
  });

  return publishedCourse;
};