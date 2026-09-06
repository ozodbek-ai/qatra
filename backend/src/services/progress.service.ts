import { prisma } from "../lib/prisma.js";
import * as challengeService from "./challenge.service.js";
import * as courseCompletionService from "./course-completion.service.js";
import * as progressRepository from "../repositories/progress.repository.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import * as lessonRepository from "../repositories/lesson.repository.js";

import { AppError } from "../utils/AppError.js";
import {
  getPagination,
  type PaginationQuery,
} from "../utils/pagination.js";

export const completeLesson = async (
  userId: string,
  lessonId: string
) => {
const lesson =
  await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      isPublished: true,
    },
    include: {
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

  // Agar darsda quiz mavjud bo'lsa,
  // quiz muvaffaqiyatli topshirilgan bo'lishi kerak.
  if (lesson.quiz) {
    const passedAttempt =
      await prisma.quizAttempt.findFirst({
        where: {
          userId,
          quizId: lesson.quiz.id,
          passed: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!passedAttempt) {
      throw new AppError(
        "Avval ushbu dars quizini muvaffaqiyatli topshiring.",
        400
      );
    }
  }

  const progress =
    await progressRepository.findProgress(
      userId,
      lessonId
    );

  let result;

  if (progress) {
    result =
      await progressRepository.updateProgress(
        userId,
        lessonId
      );
  } else {
    result =
      await progressRepository.createProgress(
        userId,
        lessonId
      );
  }

  // Kurs yakunlanganligini tekshirish
  await courseCompletionService.checkCourseCompletion(
    userId,
    lesson.courseId
  );
  await challengeService.updateUserCourseChallenges(
  userId,
  lesson.courseId
);


  return result;
};

export const getCourseProgress = async (
  userId: string,
  courseId: string
) => {
  const course =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  const lessonIds =
    course.lessons.map(
      (lesson) => lesson.id
    );

  const completedLessons =
    await progressRepository.countCompletedLessons(
      userId,
      lessonIds
    );

  const totalLessons =
    course.lessons.length;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons /
            totalLessons) *
            100
        );

  return {
    courseId: course.id,
    courseTitle: course.title,
    completedLessons,
    totalLessons,
    progress,
  };
};

export const continueLearning = async (
  userId: string,
  courseId: string
) => {
  const course =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }

  const lessons =
    await lessonRepository.findLessonsByCourseOrdered(
      courseId
    );

  const lessonIds =
    lessons.map(
      (lesson) => lesson.id
    );

  const completed =
    await progressRepository.getCompletedLessonIds(
      userId,
      lessonIds
    );

  const completedIds = new Set(
    completed.map(
      (item) => item.lessonId
    )
  );

  const nextLesson =
    lessons.find(
      (lesson) =>
        !completedIds.has(lesson.id)
    );

  return {
    courseId,
    courseTitle: course.title,
    nextLesson:
      nextLesson ?? null,
  };
};
export const getAllProgress = async (
  query: PaginationQuery
) => {
  const {
    page,
    limit,
    skip,
    take,
  } = getPagination(query);

  const search =
    query.search?.trim();

  const result =
    await progressRepository.getAllProgress(
      skip,
      take,
      search
    );

  return {
    items: result.progress.map(
      (item) => ({
        id: item.id,

        completed:
          item.completed,

        completedAt:
          item.completedAt,

        lastViewedAt:
          item.lastViewedAt,

        student: {
          id: item.user.id,
          fullName:
            item.user.fullName,
          email:
            item.user.email,
        },

        lesson: {
          id: item.lesson.id,
          title:
            item.lesson.title,
        },

        course: {
          id:
            item.lesson.course.id,
          title:
            item.lesson.course.title,
        },
      })
    ),

    pagination: {
      page,
      limit,
      total: result.total,
      totalPages:
        Math.ceil(
          result.total / limit
        ),
    },
  };
};