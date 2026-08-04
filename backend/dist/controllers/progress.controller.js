import { asyncHandler } from "../utils/asyncHandler.js";
import * as progressService from "../services/progress.service.js";
export const completeLessonController = asyncHandler(async (req, res) => {
    const progress = await progressService.completeLesson(req.user.userId, req.params.lessonId);
    res.json({
        success: true,
        message: "Dars muvaffaqiyatli yakunlandi.",
        data: progress,
    });
});
export const getCourseProgressController = asyncHandler(async (req, res) => {
    const progress = await progressService.getCourseProgress(req.user.userId, req.params.courseId);
    res.json({
        success: true,
        data: progress,
    });
});
export const continueLearningController = asyncHandler(async (req, res) => {
    const data = await progressService.continueLearning(req.user.userId, req.params.courseId);
    res.json({
        success: true,
        data,
    });
});
