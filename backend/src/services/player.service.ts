import * as playerRepository from "../repositories/player.repository.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";

import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { AppError } from "../utils/AppError.js";
import * as courseCompletionService from "./course-completion.service.js";
import {
  createUserActivity,
  addActivityDuration,
} from "../repositories/activity.repository.js";

export const getCoursePlayer = async (
  userId: string,
  courseId: string
) => {
  logger.info({
    message: "Loading course player",
    userId,
    courseId,
  });

  /*
   * Kursni va faqat published lessonlarni olamiz.
   */
  const course =
    await playerRepository.findCourseWithLessons(
      courseId
    );

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  /*
   * Student kursga yozilganmi?
   */
  const enrollment =
    await enrollmentRepository.findEnrollmentByUserAndCourse(
      userId,
      courseId
    );

  if (!enrollment) {
    throw new AppError(
      "Siz bu kursga yozilmagansiz.",
      403
    );
  }

  /*
   * Kursdagi lesson ID'lari.
   */
  const lessonIds = course.lessons.map(
    (lesson) => lesson.id
  );

  /*
   * Student completed qilgan lessonlar.
   */
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

  /*
   * Lessonlarga completed holatini qo'shamiz.
   */
  const lessons = course.lessons.map(
    (lesson) => ({
      ...lesson,
      completed:
        completedIds.has(lesson.id),
    })
  );

  /*
   * Umumiy lesson progress.
   */
  const completedCount =
    completedIds.size;

  const progress =
    lessons.length === 0
      ? 0
      : Math.round(
          (completedCount /
            lessons.length) *
            100
        );

  /*
   * Student oxirgi qaysi lessonni
   * ko'rganini aniqlaymiz.
   */
  const lastViewed =
    lessonIds.length > 0
      ? await playerRepository.findLastViewedLesson(
          userId,
          lessonIds
        )
      : null;

  /*
   * Keyingi/davom ettiriladigan lesson.
   *
   * 1. Oxirgi ko'rilgan lesson tugallanmagan
   *    bo'lsa — o'sha lesson.
   *
   * 2. Aks holda — birinchi tugallanmagan lesson.
   *
   * 3. Hammasi tugagan bo'lsa — null.
   */
  const nextLesson =
    lastViewed &&
    !completedIds.has(
      lastViewed.lessonId
    )
      ? lessons.find(
          (lesson) =>
            lesson.id ===
            lastViewed.lessonId
        )
      : lessons.find(
          (lesson) =>
            !lesson.completed
        );

  /*
   * Kurs Completion mavjudligini tekshiramiz.
   *
   * CourseCompletion faqat:
   * - barcha lessonlar completed
   * - barcha quizlar passed
   *
   * bo'lganda yaratiladi.
   */
  const completion =
    await prisma.courseCompletion.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },

      select: {
        id: true,
        completedAt: true,
      },
    });

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
    },

    progress,

    /*
     * Kurs to'liq tugaganmi?
     */
    isCompleted: Boolean(completion),

    /*
     * Kurs tugagan sana.
     */
    completedAt:
      completion?.completedAt ?? null,

    completedLessons: [
      ...completedIds,
    ],

    lessons,

    nextLesson:
      nextLesson ?? null,
  };
};


/*
|--------------------------------------------------------------------------
| Mark lesson as viewed
|--------------------------------------------------------------------------
*/

export const markLessonAsViewed = async (
  userId: string,
  lessonId: string
) => {
  const lesson =
    await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },

      select: {
        id: true,
        courseId: true,
        isPublished: true,
      },
    });

  if (!lesson) {
    throw new AppError(
      "Dars topilmadi.",
      404
    );
  }

  if (!lesson.isPublished) {
    throw new AppError(
      "Bu dars hozircha mavjud emas.",
      404
    );
  }

  /*
   * Student shu lesson joylashgan
   * kursga yozilganligini tekshiramiz.
   */
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

  /*
   * Lesson ko'rilgan vaqtni yangilaymiz.
   */
await playerRepository.updateLastViewedLesson(
  userId,
  lessonId
);

const activity =
  await createUserActivity(
    userId,
    "LESSON_VIEW",
    {
      lessonId: lesson.id,
      courseId: lesson.courseId,
    }
  );

return {
  lessonId,
  activityId: activity.id,
};
};


/*
|--------------------------------------------------------------------------
| Complete lesson
|--------------------------------------------------------------------------
*/

export const completeLesson = async (
  userId: string,
  lessonId: string
) => {
  /*
   * Lessonni olamiz.
   */
  const lesson =
    await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },

      select: {
        id: true,
        courseId: true,
        isPublished: true,

        quiz: {
          select: {
            id: true,
          },
        },
      },
    });

  if (!lesson) {
    throw new AppError(
      "Dars topilmadi.",
      404
    );
  }

  if (!lesson.isPublished) {
    throw new AppError(
      "Bu dars hozircha mavjud emas.",
      404
    );
  }

  /*
   * Student kursga yozilganmi?
   */
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

  /*
   * Agar lesson ichida quiz bo'lsa,
   * student Complete tugmasi orqali
   * uni qo'lda yakunlay olmaydi.
   *
   * Quiz muvaffaqiyatli topshirilganda
   * quiz.service.ts lessonProgress'ni
   * completed qiladi.
   */
  if (lesson.quiz) {
    throw new AppError(
      "Bu darsni yakunlash uchun avval quizni topshirishingiz kerak.",
      400
    );
  }

  /*
   * Lessonni completed qilamiz.
   */
  const progress =
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },

      update: {
        completed: true,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },

      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },
    });

  /*
   * Lesson completed bo'lgandan keyin
   * kurs to'liq tugaganmi tekshiramiz.
   *
   * Agar:
   * - barcha lessonlar completed
   * - barcha quizlar passed
   *
   * bo'lsa:
   *
   * CourseCompletion yaratiladi.
   * Certificate yaratiladi.
   */
  await courseCompletionService.checkCourseCompletion(
    userId,
    lesson.courseId
  );

  return {
    lessonId: progress.lessonId,
    completed: progress.completed,
    completedAt: progress.completedAt,
  };
};

export const addLessonViewDuration = async (
  userId: string,
  activityId: string,
  durationSeconds: number
) => {
  const activity =
    await addActivityDuration(
      activityId,
      userId,
      durationSeconds
    );

  if (!activity) {
    throw new AppError(
      "Dars ko'rish faoliyati topilmadi.",
      404
    );
  }

  return {
    activityId: activity.id,
    durationSeconds:
      activity.durationSeconds,
  };
};