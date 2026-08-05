import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

import * as lessonRepository from "../repositories/lesson.repository.js";
import * as courseRepository from "../repositories/course.repository.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";

import type { CreateLessonInput } from "../validators/lesson.validator.js";
import type { Prisma } from "../generated/prisma/client.js";

export const createLesson = async (
  data: CreateLessonInput
) => {
  const course =
    await courseRepository.findCourseById(
      data.courseId
    );

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  const lesson =
    await lessonRepository.createLesson(
      data
    );

  logger.info({
    message: "Lesson created",
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    courseId: lesson.courseId,
  });

  return lesson;
};

export const getLessonsByCourse = async (
  courseId: string
) => {
  const course =
    await courseRepository.findCourseById(
      courseId
    );

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  logger.info({
    message: "Lessons fetched",
    courseId,
  });

  return lessonRepository.findLessonsByCourse(
    courseId
  );
};

export const getLessonById = async (
  lessonId: string,
  userId?: string,
  role?: string
) => {
  const lesson =
    await lessonRepository.findLessonById(
      lessonId
    );

  if (!lesson) {
    throw new AppError(
      "Dars topilmadi.",
      404
    );
  }

  if (lesson.isPreview) {
    return lesson;
  }

  if (role === "ADMIN") {
    return lesson;
  }

  if (!userId) {
    throw new AppError(
      "Ruxsat yo'q.",
      401
    );
  }

  const enrollment =
    await enrollmentRepository.findEnrollmentByUserAndCourse(
      userId,
      lesson.courseId
    );

  if (!enrollment) {
    throw new AppError(
      "Siz bu kursga yozilmagansiz.",
      403
    );
  }

  return lesson;
};

export const updateLesson = async (
  id: string,
  data: Prisma.LessonUpdateInput
) => {
  const lesson =
    await lessonRepository.findLessonById(
      id
    );

  if (!lesson) {
    throw new AppError(
      "Dars topilmadi.",
      404
    );
  }

  const updatedLesson =
    await lessonRepository.updateLesson(
      id,
      data
    );

  logger.info({
    message: "Lesson updated",
    lessonId: id,
  });

  return updatedLesson;
};

export const deleteLesson = async (
  id: string
) => {
  const lesson =
    await lessonRepository.findLessonById(
      id
    );

  if (!lesson) {
    throw new AppError(
      "Dars topilmadi.",
      404
    );
  }

  await lessonRepository.deleteLesson(
    id
  );

  logger.info({
    message: "Lesson deleted",
    lessonId: id,
  });
};