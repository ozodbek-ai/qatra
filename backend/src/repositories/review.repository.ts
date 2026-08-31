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

export const createReview = async (
  userId: string,
  data: CreateReviewInput
) => {
  const review =
    await prisma.review.create({
      data: {
        userId,
        courseId: data.courseId,
        rating: data.rating,
        comment: data.comment,
      },
    });

  await updateCourseAverageRating(
    data.courseId
  );

  return review;
};

export const updateReview = async (
  reviewId: string,
  data: UpdateReviewInput
) => {
  const review =
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
    });

  await updateCourseAverageRating(
    review.courseId
  );

  return review;
};

const updateCourseAverageRating = async (
  courseId: string
) => {
  const result =
    await prisma.review.aggregate({
      where: {
        courseId,
      },
      _avg: {
        rating: true,
      },
    });

  const averageRating =
    result._avg.rating ?? 0;

  await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      averageRating,
    },
  });
};



export const deleteReview = async (
  reviewId: string
) => {
  const review =
    await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        courseId: true,
      },
    });

  if (!review) {
    return;
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  await updateCourseAverageRating(
    review.courseId
  );
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
export const getAllReviews = () => {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};