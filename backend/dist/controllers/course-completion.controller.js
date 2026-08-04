import { asyncHandler } from "../utils/asyncHandler.js";
import * as completionService from "../services/course-completion.service.js";
export const getCompletedCoursesController = asyncHandler(async (req, res) => {
    const data = await completionService.getCompletedCourses(req.user.userId);
    res.json({
        success: true,
        data,
    });
});
