import { prisma } from "../lib/prisma.js";
import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../validators/review.validator.js";

export const findReview = (
  userId: string,
  courseId: string
) => {
  return prisma.review.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};

export const createReview = (
  userId: string,
  data: CreateReviewInput
) => {
  return prisma.review.create({
    data: {
      userId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const updateReview = (
  reviewId: string,
  data: UpdateReviewInput
) => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const deleteReview = (
  reviewId: string
) => {
  return prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

export const getCourseReviews = (
  courseId: string
) => {
  return prisma.review.findMany({
    where: {
      courseId,
    },
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};