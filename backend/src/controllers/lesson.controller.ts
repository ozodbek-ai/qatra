import { asyncHandler } from "../utils/asyncHandler.js";
import * as lessonService from "../services/lesson.service.js";
import { createLessonSchema } from "../validators/lesson.validator.js";

export const createLessonController = asyncHandler(
  async (req, res) => {
    const data = createLessonSchema.parse(req.body);

    const lesson = await lessonService.createLesson(data);

    res.status(201).json({
      success: true,
      message: "Dars muvaffaqiyatli yaratildi.",
      data: lesson,
    });
  }
);