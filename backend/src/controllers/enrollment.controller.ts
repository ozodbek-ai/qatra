import type { Request, Response } from "express";

import { logger } from "../lib/logger.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import * as enrollmentService from "../services/enrollment.service.js";

import {
  enrollmentSchema,
} from "../validators/enrollment.validator.js";

export const enrollController =
  asyncHandler(async (req: Request, res: Response) => {
    const { courseId } =
      enrollmentSchema.parse(req.body);

    const enrollment =
      await enrollmentService.enroll(
        req.user!.userId,
        courseId
      );

    logger.info({
      message: "Enrollment created",
      userId: req.user!.userId,
      courseId,
    });

    res.status(201).json({
      success: true,
      message:
        "Kursga muvaffaqiyatli yozildingiz.",
      data: enrollment,
    });
  });

export const myCoursesController =
  asyncHandler(async (req: Request, res: Response) => {
    const courses =
      await enrollmentService.getMyCourses(
        req.user!.userId
      );

    res.status(200).json({
      success: true,
      data: courses,
    });
  });