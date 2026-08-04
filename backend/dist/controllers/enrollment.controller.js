import { asyncHandler } from "../utils/asyncHandler.js";
import * as enrollmentService from "../services/enrollment.service.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";
export const enrollController = asyncHandler(async (req, res) => {
    const { courseId } = enrollmentSchema.parse(req.body);
    const enrollment = await enrollmentService.enroll(req.user.userId, courseId);
    res.status(201).json({
        success: true,
        message: "Kursga muvaffaqiyatli yozildingiz.",
        data: enrollment,
    });
});
export const myCoursesController = asyncHandler(async (req, res) => {
    const courses = await enrollmentService.getMyCourses(req.user.userId);
    res.json({
        success: true,
        data: courses,
    });
});
