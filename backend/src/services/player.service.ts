import * as playerRepository from "../repositories/player.repository.js";
import { logger } from "../lib/logger.js";
import { AppError } from "../utils/AppError.js";

export const getCoursePlayer = async (
  userId: string,
  courseId: string
) => {
  logger.info({
    message: "Loading course player",
    userId,
    courseId,
  });

  const course =
    await playerRepository.findCourseWithLessons(
      courseId
    );

  if (!course) {
    logger.warn({
      message: "Course not found",
      courseId,
    });

    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  const lessonIds = course.lessons.map(
    (lesson) => lesson.id
  );

  const completed =
    await playerRepository.findCompletedLessons(
      userId,
      lessonIds
    );

  const completedIds = new Set(
    completed.map(
      (item) => item.lessonId
    )
  );

  const lessons = course.lessons.map(
    (lesson) => ({
      ...lesson,
      completed: completedIds.has(lesson.id),
    })
  );

  const completedCount = completedIds.size;

  const progress =
    lessons.length === 0
      ? 0
      : Math.round(
          (completedCount / lessons.length) * 100
        );

  const nextLesson = lessons.find(
    (lesson) => !lesson.completed
  );

  logger.info({
    message: "Course player loaded",
    userId,
    courseId,
    progress,
    completedLessons: completedCount,
    totalLessons: lessons.length,
  });

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
    },
    progress,
    completedLessons: [...completedIds],
    lessons,
    nextLesson: nextLesson ?? null,
  };
};