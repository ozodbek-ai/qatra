import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";
import {
  getPagination,
  type PaginationQuery,
} from "../utils/pagination.js";

import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import * as courseRepository from "../repositories/course.repository.js";
import * as notificationService from
  "./notification.service.js";
  import {
  createNotification,
} from "./notification.service.js";

export const enroll = async (
  userId: string,
  courseId: string
) => {
  const course =
    await courseRepository.findPublishedCourseById(
      courseId
    );

  if (!course) {
    throw new AppError(
      "Kurs topilmadi yoki hali nashr qilinmagan.",
      404
    );
  }

  const enrollment =
    await enrollmentRepository.findEnrollment(
      userId,
      courseId
    );

  if (enrollment) {
    throw new AppError(
      "Siz bu kursga allaqachon yozilgansiz.",
      409
    );
  }

const createdEnrollment =
  await enrollmentRepository.createEnrollment(
    userId,
    courseId
  );

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Course enrollment notification
|--------------------------------------------------------------------------
*/

await createNotification({
  userId,

  type: "COURSE_ENROLLED",

  title: "Kursga yozildingiz",

  message:
    `"${course.title}" kursiga muvaffaqiyatli yozildingiz.`,

  link:
    `/courses/${courseId}`,

  metadata: {
    courseId,
    enrollmentId:
      createdEnrollment.id,
  },
});

logger.info({
  message: "Student enrolled",
  userId,
  courseId,
  enrollmentId: createdEnrollment.id,
});

return createdEnrollment;
};

export const getMyCourses = async (
  userId: string
) => {
  const enrollments =
    await enrollmentRepository.getUserEnrollments(
      userId
    );

  return enrollments.map((enrollment) => {
    const totalLessons =
      enrollment.course.lessons.length;

    const completedLessons =
      enrollment.course.lessons.filter(
        (lesson) =>
          lesson.progress.length > 0
      ).length;

    const progress =
      totalLessons === 0
        ? 0
        : Math.round(
            (completedLessons /
              totalLessons) *
              100
          );

    return {
      id: enrollment.id,

      enrolledAt:
        enrollment.enrolledAt,

      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        description:
          enrollment.course.description,
        imageUrl:
          enrollment.course.imageUrl,

        price: Number(
          enrollment.course.price
        ),

        level:
          enrollment.course.level,

        isPublished:
          enrollment.course.isPublished,

        totalLessons,

        completedLessons,

        progress,

        /*
         * Kurs tugatilganmi?
         */
        completions:
          enrollment.course.completions.map(
            (completion) => ({
              id: completion.id,
              completedAt:
                completion.completedAt,
            })
          ),

        /*
         * Studentning ushbu kursdagi
         * mavjud baholari.
         */
        reviews:
          enrollment.course.reviews.map(
            (review) => ({
              rating: review.rating,
            })
          ),
      },
    };
  });
};

export const getAllEnrollments = async (
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
    await enrollmentRepository.getAllEnrollments(
      skip,
      take,
      search
    );

  return {
    items: result.enrollments.map(
      (enrollment) => ({
        id: enrollment.id,

        enrolledAt:
          enrollment.enrolledAt,

        student: {
          id: enrollment.user.id,
          fullName:
            enrollment.user.fullName,
          email:
            enrollment.user.email,
        },

        course: {
          id: enrollment.course.id,
          title:
            enrollment.course.title,
          slug:
            enrollment.course.slug,
          imageUrl:
            enrollment.course.imageUrl,
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