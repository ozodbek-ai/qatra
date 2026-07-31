import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCourses } from "../services/course.service.js";

export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await getCourses();

  res.status(200).json({
    success: true,
    data: courses,
  });
});