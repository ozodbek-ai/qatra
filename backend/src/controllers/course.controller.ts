import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCourses } from "../services/course.service.js";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.validator.js";
import * as courseService from "../services/course.service.js";
import { publishCourseSchema } from "../validators/course.validator.js";

export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await getCourses();

  res.status(200).json({
    success: true,
    data: courses,
  });
});
export const createCourseController = asyncHandler(
  async (req, res) => {
    const data = createCourseSchema.parse(req.body);

    const course = await courseService.createCourse(data);

    res.status(201).json({
      success: true,
      message: "Kurs muvaffaqiyatli yaratildi.",
      data: course,
    });
  }
);
export const getAllCoursesController = asyncHandler(
  async (_req, res) => {
    const courses = await courseService.getAllCourses();

    res.json({
      success: true,
      data: courses,
    });
  }
);
export const getCourseBySlugController = asyncHandler(
  async (req, res) => {
    const course = await courseService.getCourseBySlug(
  req.params.slug as string
);

    res.json({
      success: true,
      data: course,
    });
  }
);
export const updateCourseController = asyncHandler(async (req, res) => {
  const data = updateCourseSchema.parse(req.body);

  const course = await courseService.updateCourse(
  req.params.id as string,
  data
);

  res.json({
    success: true,
    message: "Kurs yangilandi.",
    data: course,
  });
});
export const deleteCourseController = asyncHandler(
  async (req, res) => {
    await courseService.deleteCourse(
  req.params.id as string
);

    res.json({
      success: true,
      message: "Kurs muvaffaqiyatli o'chirildi.",
    });
  }
);
export const publishCourseController =
asyncHandler(async (req, res) => {

  const body =
    publishCourseSchema.parse(req.body);

  const course =
    await courseService.publishCourse(
  req.params.id as string,
  body
);

  res.json({
    success: true,
    message: body.isPublished
      ? "Kurs muvaffaqiyatli nashr qilindi."
      : "Kurs draft holatiga qaytarildi.",
    data: course,
  });

});