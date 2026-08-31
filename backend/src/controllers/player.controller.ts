import { asyncHandler } from "../utils/asyncHandler.js";
import * as playerService from "../services/player.service.js";
import { AppError } from "../utils/AppError.js";

export const coursePlayerController =
  asyncHandler(async (req, res) => {
    const data =
      await playerService.getCoursePlayer(
        req.user!.userId,
        req.params.id as string
      );

    res.json({
      success: true,
      data,
    });
  });

export const markLessonAsViewedController =
  asyncHandler(async (req, res) => {
    const data =
      await playerService.markLessonAsViewed(
        req.user!.userId,
        req.params.lessonId as string
      );

    res.json({
      success: true,
      data,
    });
  });

  export const completeLessonController =
  asyncHandler(async (req, res) => {
    const data =
      await playerService.completeLesson(
        req.user!.userId,
        req.params.lessonId as string
      );

    res.json({
      success: true,
      message: "Dars muvaffaqiyatli yakunlandi.",
      data,
    });
  });

  export const addLessonViewDurationController =
  asyncHandler(async (req, res) => {
    const activityId =
      req.body.activityId;

    const durationSeconds =
      Number(req.body.durationSeconds);

    if (
      typeof activityId !== "string" ||
      !activityId
    ) {
      throw new AppError(
        "Activity ID noto'g'ri.",
        400
      );
    }

    if (
      !Number.isFinite(durationSeconds) ||
      durationSeconds <= 0
    ) {
      throw new AppError(
        "Dars ko'rish vaqti noto'g'ri.",
        400
      );
    }

    const data =
      await playerService.addLessonViewDuration(
        req.user!.userId,
        activityId,
        durationSeconds
      );

    res.json({
      success: true,
      data,
    });
  });