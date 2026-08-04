import * as reviewRepository from "../repositories/review.repository.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../validators/review.validator.js";

export const createReview = async (
  userId: string,
  data: CreateReviewInput
) => {

  const enrollment =
    await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: data.courseId,
      },
    });

  if (!enrollment) {
    throw new AppError(
      "Siz bu kursga yozilmagansiz.",
      403
    );
  }

  const completion =
    await prisma.courseCompletion.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: data.courseId,
        },
      },
    });

  if (!completion) {
    throw new AppError(
      "Review yozish uchun kursni tugatishingiz kerak.",
      403
    );
  }

  const existing =
    await reviewRepository.findReview(
      userId,
      data.courseId
    );

  if (existing) {
    throw new AppError(
      "Siz bu kursga allaqachon baho bergansiz.",
      400
    );
  }

  return reviewRepository.createReview(
    userId,
    data
  );

};

export const updateReview = async (
  userId: string,
  courseId: string,
  data: UpdateReviewInput
) => {

  const review =
    await reviewRepository.findReview(
      userId,
      courseId
    );

  if (!review) {
    throw new AppError(
      "Review topilmadi.",
      404
    );
  }

  return reviewRepository.updateReview(
    review.id,
    data
  );

};

export const deleteReview = async (
  userId: string,
  courseId: string
) => {

  const review =
    await reviewRepository.findReview(
      userId,
      courseId
    );

  if (!review) {
    throw new AppError(
      "Review topilmadi.",
      404
    );
  }

  await reviewRepository.deleteReview(
    review.id
  );

};

export const getCourseReviews = (
  courseId: string
) => {
  return reviewRepository.getCourseReviews(
    courseId
  );
};