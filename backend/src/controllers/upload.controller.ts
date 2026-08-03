import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadVideo } from "../services/upload.service.js";
import { AppError } from "../utils/AppError.js";

export const uploadVideoController = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      throw new AppError(
        "Video fayl topilmadi.",
        400
      );
    }

    const result = await uploadVideo(req.file);

    res.json({
      success: true,
      data: {
        url: result.secure_url,
      },
    });
  }
);