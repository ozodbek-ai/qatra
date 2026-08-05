import { asyncHandler } from "../utils/asyncHandler.js";
import * as lessonService from "../services/lesson.service.js";
import {
  createLessonSchema,
  updateLessonSchema,
} from "../validators/lesson.validator.js";
import { uploadVideo } from "../services/upload.service.js";


export const createLessonController = asyncHandler(
  async (req, res) => {
    let videoUrl = req.body.videoUrl;

    if (req.file) {
      const result = await uploadVideo(req.file);

      videoUrl = (result as { secure_url: string }).secure_url;
    }

    const data = createLessonSchema.parse({
      ...req.body,
      videoUrl,
      duration: Number(req.body.duration),
      order: Number(req.body.order),
      isPreview:
        req.body.isPreview === "true" ||
        req.body.isPreview === true,
    });

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
    const lessons =
      await lessonService.getLessonsByCourse(
        req.params.courseId as string
      );

    res.json({
      success: true,
      data: lessons,
    });
  }
);


export const getLessonByIdController = asyncHandler(
  async (req, res) => {
    const lesson =
  await lessonService.getLessonById(
    req.params.id as string,
    req.user?.userId,
    req.user?.role
  );

    res.json({
      success: true,
      data: lesson,
    });
  }
);


export const updateLessonController = asyncHandler(
  async (req, res) => {
    let videoUrl = req.body.videoUrl;

    if (req.file) {
      const result = await uploadVideo(req.file);

      videoUrl = (result as { secure_url: string }).secure_url;
    }

    const data = updateLessonSchema.parse({
      ...req.body,
      videoUrl,
      duration: req.body.duration
        ? Number(req.body.duration)
        : undefined,
      order: req.body.order
        ? Number(req.body.order)
        : undefined,
      isPreview:
        req.body.isPreview === "true" ||
        req.body.isPreview === true,
    });

    const lesson =
      await lessonService.updateLesson(
        req.params.id as string,
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
    await lessonService.deleteLesson(
      req.params.id as string,
    );

    res.json({
      success: true,
      message:
        "Dars muvaffaqiyatli o'chirildi.",
    });
  }
);