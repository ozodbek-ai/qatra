import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../lib/logger.js";
import * as courseService from "../services/course.service.js";
import { createCourseSchema, updateCourseSchema, publishCourseSchema, courseIdSchema, courseSlugSchema, } from "../validators/course.validator.js";
export const getAllCoursesController = asyncHandler(async (_req, res) => {
    const courses = await courseService.getCourses();
    res.status(200).json({
        success: true,
        data: courses,
    });
});
export const getCourseBySlugController = asyncHandler(async (req, res) => {
    const { slug } = courseSlugSchema.parse(req.params);
    const course = await courseService.getCourseBySlug(slug);
    res.status(200).json({
        success: true,
        data: course,
    });
});
export const createCourseController = asyncHandler(async (req, res) => {
    const data = createCourseSchema.parse(req.body);
    const course = await courseService.createCourse(data);
    logger.info({
        message: "Course created",
        courseId: course.id,
    });
    res.status(201).json({
        success: true,
        message: "Kurs muvaffaqiyatli yaratildi.",
        data: course,
    });
});
export const updateCourseController = asyncHandler(async (req, res) => {
    const { id } = courseIdSchema.parse(req.params);
    const data = updateCourseSchema.parse(req.body);
    const course = await courseService.updateCourse(id, data);
    logger.info({
        message: "Course updated",
        courseId: id,
    });
    res.status(200).json({
        success: true,
        message: "Kurs muvaffaqiyatli yangilandi.",
        data: course,
    });
});
export const deleteCourseController = asyncHandler(async (req, res) => {
    const { id } = courseIdSchema.parse(req.params);
    await courseService.deleteCourse(id);
    logger.info({
        message: "Course deleted",
        courseId: id,
    });
    res.status(200).json({
        success: true,
        message: "Kurs muvaffaqiyatli o'chirildi.",
    });
});
export const publishCourseController = asyncHandler(async (req, res) => {
    const { id } = courseIdSchema.parse(req.params);
    const data = publishCourseSchema.parse(req.body);
    const course = await courseService.publishCourse(id, data);
    logger.info({
        message: data.isPublished
            ? "Course published"
            : "Course unpublished",
        courseId: id,
    });
    res.status(200).json({
        success: true,
        message: data.isPublished
            ? "Kurs muvaffaqiyatli nashr qilindi."
            : "Kurs draft holatiga qaytarildi.",
        data: course,
    });
});
export const getAdminCoursesController = asyncHandler(async (_req, res) => {
    const courses = await courseService.getAdminCourses();
    res.json({
        success: true,
        data: courses,
    });
});
