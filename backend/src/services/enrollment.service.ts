import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";
import {
  getPagination,
  type PaginationQuery,
} from "../utils/pagination.js";

import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import * as courseRepository from "../repositories/course.repository.js";

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
  return enrollmentRepository.getUserEnrollments(
    userId
  );
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