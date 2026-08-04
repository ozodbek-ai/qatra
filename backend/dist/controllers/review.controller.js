import { asyncHandler } from "../utils/asyncHandler.js";
import * as reviewService from "../services/review.service.js";
import { createReviewSchema, updateReviewSchema, } from "../validators/review.validator.js";
export const createReviewController = asyncHandler(async (req, res) => {
    const body = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.user.userId, body);
    res.status(201).json({
        success: true,
        message: "Review muvaffaqiyatli yaratildi.",
        data: review,
    });
});
export const getCourseReviewsController = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getCourseReviews(req.params.courseId);
    res.json({
        success: true,
        data: reviews,
    });
});
export const updateReviewController = asyncHandler(async (req, res) => {
    const body = updateReviewSchema.parse(req.body);
    const review = await reviewService.updateReview(req.user.userId, req.params.courseId, body);
    res.json({
        success: true,
        message: "Review yangilandi.",
        data: review,
    });
});
export const deleteReviewController = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(req.user.userId, req.params.courseId);
    res.json({
        success: true,
        message: "Review o'chirildi.",
    });
});
