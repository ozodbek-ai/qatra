import { prisma } from "../lib/prisma.js";
export const findReview = (userId, courseId) => {
    return prisma.review.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
};
export const createReview = (userId, data) => {
    return prisma.review.create({
        data: {
            userId,
            courseId: data.courseId,
            rating: data.rating,
            comment: data.comment,
        },
    });
};
export const updateReview = (reviewId, data) => {
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
export const deleteReview = (reviewId) => {
    return prisma.review.delete({
        where: {
            id: reviewId,
        },
    });
};
export const getCourseReviews = (courseId) => {
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
