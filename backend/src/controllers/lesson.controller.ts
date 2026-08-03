import { asyncHandler } from "../utils/asyncHandler.js";
import * as lessonService from "../services/lesson.service.js";
import { createLessonSchema } from "../validators/lesson.validator.js";
import { updateLessonSchema } from "../validators/lesson.validator.js";

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
export const getLessonsByCourseController = asyncHandler(
  async (req, res) => {
    const lessons = await lessonService.getLessonsByCourse(
      req.params.courseId
    );

    res.json({
      success: true,
      data: lessons,
    });
  }
);
export const getLessonByIdController = asyncHandler(
  async (req, res) => {
    const lesson = await lessonService.getLessonById(
      req.params.id
    );

    res.json({
      success: true,
      data: lesson,
    });
  }
);
export const updateLessonController = asyncHandler(
  async (req, res) => {
    console.log("BODY:", req.body);
    
    const data = updateLessonSchema.parse(req.body);

    const lesson = await lessonService.updateLesson(
      req.params.id,
      data
    );

    res.json({
      success: true,
      message: "Dars muvaffaqiyatli yangilandi.",
      data: lesson,
    });
  }
);
export const deleteLessonController = asyncHandler(
  async (req, res) => {
    await lessonService.deleteLesson(req.params.id);

    res.json({
      success: true,
      message: "Dars muvaffaqiyatli o'chirildi.",
    });
  }
);