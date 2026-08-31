import { asyncHandler } from "../utils/asyncHandler.js";

import {
  uploadVideo,
  uploadAvatar,
  uploadCourseImage,
} from "../services/upload.service.js";

import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";

export const uploadVideoController =
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError(
        "Video fayl topilmadi.",
        400
      );
    }

    const result =
      await uploadVideo(req.file);

    res.json({
      success: true,
      data: {
        url: result.secure_url,
      },
    });
  });

export const updateMyAvatarController =
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError(
        "Avatar rasmi topilmadi.",
        400
      );
    }

    const result =
      await uploadAvatar(req.file);

    const user =
      await prisma.user.update({
        where: {
          id: req.user!.userId,
        },

        data: {
          avatarUrl:
            result.secure_url,
        },

        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      });

    res.json({
      success: true,

      message:
        "Profil rasmi muvaffaqiyatli yangilandi.",

      data: user,
    });
  });

export const uploadCourseImageController =
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError(
        "Kurs rasmi topilmadi.",
        400
      );
    }

    const result =
      await uploadCourseImage(req.file);

    res.json({
      success: true,

      data: {
        url: result.secure_url,
      },
    });
  });