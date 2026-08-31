import * as studentRepository from "../repositories/student.repository.js";
import { AppError } from "../utils/AppError.js";

import {
  getPagination,
  type PaginationQuery,
} from "../utils/pagination.js";

export const getStudents = async (
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

  const [
    students,
    total,
  ] = await Promise.all([
    studentRepository.findStudents(
      skip,
      take,
      search
    ),

    studentRepository.countStudents(
      search
    ),
  ]);

  return {
    items: students.map(
      (student) => ({
        id: student.id,

        fullName:
          student.fullName,

        email:
          student.email,

        joinedAt:
          student.createdAt,

        isActive:
          student.isActive,

        lastLoginAt:
          student.lastLoginAt,

        enrolledCourses:
          student._count.enrollments,

        quizAttempts:
          student._count.quizAttempts,

        completedCourses:
          student._count.courseCompletions,

        completedLessons:
          student._count.lessonProgress,

        certificates:
          student._count.certificates,

        reviews:
          student._count.reviews,
      })
    ),

    pagination: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
};

export const getStudentById = async (
  id: string
) => {
const student =
  await studentRepository.findStudentById(
    id
  );

if (!student) {
  throw new AppError(
    "Student topilmadi.",
    404
  );
}

if (student.role !== "STUDENT") {
  throw new AppError(
    "Bu foydalanuvchi student emas.",
    400
  );
}

const totalLessons =
  await studentRepository.countTotalLessonsForStudent(
    id
  );

const completedLessons =
  student.lessonProgress.filter(
    (item) => item.completed
  ).length;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons /
            totalLessons) *
            100
        );

  const passedQuizAttempts =
    student.quizAttempts.filter(
      (attempt) =>
        attempt.passed
    );

  const averageQuizScore =
    student.quizAttempts.length ===
    0
      ? 0
      : Math.round(
          student.quizAttempts.reduce(
            (sum, attempt) =>
              sum +
              attempt.percentage,
            0
          ) /
            student.quizAttempts.length
        );

  return {
    id: student.id,

    fullName:
      student.fullName,

    email:
      student.email,

    role:
      student.role,

    isActive:
      student.isActive,

    avatarUrl:
      student.avatarUrl,

    createdAt:
      student.createdAt,

    lastLoginAt:
      student.lastLoginAt,

    statistics: {
      enrolledCourses:
        student.enrollments.length,

      completedCourses:
        student.courseCompletions.length,

      totalLessons,

      completedLessons,

      progress,

      quizAttempts:
        student.quizAttempts.length,

      passedQuizAttempts:
        passedQuizAttempts.length,

      averageQuizScore,

      certificates:
        student.certificates.length,

      reviews:
        student.reviews.length,
    },

    enrollments:
      student.enrollments.map(
        (enrollment) => ({
          id:
            enrollment.id,

          enrolledAt:
            enrollment.enrolledAt,

          course: {
            id:
              enrollment.course.id,

            title:
              enrollment.course.title,

            slug:
              enrollment.course.slug,

            imageUrl:
              enrollment.course.imageUrl,

            isPublished:
              enrollment.course.isPublished,
          },
        })
      ),

    lessonProgress:
      student.lessonProgress.map(
        (progress) => ({
          id:
            progress.id,

          lessonId:
            progress.lessonId,

          completed:
            progress.completed,

          completedAt:
            progress.completedAt,

          lastViewedAt:
            progress.lastViewedAt,

          lesson: {
            id:
              progress.lesson.id,

            title:
              progress.lesson.title,

            courseId:
              progress.lesson.courseId,

            course: progress.lesson.course,
          },
        })
      ),

    quizAttempts:
      student.quizAttempts.map(
        (attempt) => ({
          id:
            attempt.id,

          quizId:
            attempt.quizId,

          score:
            attempt.score,

          total:
            attempt.total,

          percentage:
            attempt.percentage,

          passed:
            attempt.passed,

          createdAt:
            attempt.createdAt,

          quiz: {
            id:
              attempt.quiz.id,

            title:
              attempt.quiz.title,

            lesson:
              attempt.quiz.lesson,
          },
        })
      ),

    completions:
      student.courseCompletions.map(
        (completion) => ({
          id:
            completion.id,

          completedAt:
            completion.completedAt,

          course:
            completion.course,

          certificate:
            completion.certificate,
        })
      ),

    certificates:
      student.certificates.map(
        (certificate) => ({
          id:
            certificate.id,

          certificateNo:
            certificate.certificateNo,

          issuedAt:
            certificate.issuedAt,

          course:
            certificate.course,
        })
      ),

    reviews:
      student.reviews.map(
        (review) => ({
          id:
            review.id,

          rating:
            review.rating,

          comment:
            review.comment,

          createdAt:
            review.createdAt,

          course:
            review.course,
        })
      ),
  };
};