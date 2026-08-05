import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import * as courseRepository from "../repositories/course.repository.js";
export const enroll = async (userId, courseId) => {
    const course = await courseRepository.findPublishedCourseById(courseId);
    if (!course) {
        throw new AppError("Kurs topilmadi yoki hali nashr qilinmagan.", 404);
    }
    const enrollment = await enrollmentRepository.findEnrollment(userId, courseId);
    if (enrollment) {
        throw new AppError("Siz bu kursga allaqachon yozilgansiz.", 409);
    }
    const createdEnrollment = await enrollmentRepository.createEnrollment(userId, courseId);
    logger.info({
        message: "Student enrolled",
        userId,
        courseId,
        enrollmentId: createdEnrollment.id,
    });
    return createdEnrollment;
};
export const getMyCourses = async (userId) => {
    return enrollmentRepository.getUserEnrollments(userId);
};
