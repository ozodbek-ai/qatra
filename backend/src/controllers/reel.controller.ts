import { asyncHandler } from "../utils/asyncHandler.js";

import * as reelService from "../services/reel.service.js";

import {
  createReelSchema,
  updateReelSchema,
  createReelCommentSchema,
  createReelCategorySchema,
  updateReelCategorySchema,
} from "../validators/reel.validator.js";

import {
  uploadVideo,
  uploadCategoryImage,
} from "../services/upload.service.js";

export const createReelController =
  asyncHandler(async (req, res) => {
    let videoUrl =
      req.body.videoUrl;

    if (req.file) {
      const result =
        await uploadVideo(req.file);

      videoUrl =
        result.secure_url;
    }

    const data =
      createReelSchema.parse({
        ...req.body,
        videoUrl,
        isPublished:
          req.body.isPublished === true ||
          req.body.isPublished === "true",
      });

    const reel =
      await reelService.createReel(
        data
      );

    res.status(201).json({
      success: true,
      message:
        "Reel muvaffaqiyatli yaratildi.",
      data: reel,
    });
  });

export const getPublishedReelsController =
  asyncHandler(async (req, res) => {
    const reels =
      await reelService.getPublishedReels(
        req.user!.userId
      );

    res.json({
      success: true,
      data: reels,
    });
  });

export const getSharedReelController =
  asyncHandler(async (req, res) => {
    const reel =
      await reelService.getPublishedReelById(
        req.params.id as string,
        req.user!.userId
      );

    res.json({
      success: true,
      data: reel,
    });
  });

export const getAllReelsController =
  asyncHandler(async (_req, res) => {
    const reels =
      await reelService.getAllReels();

    res.json({
      success: true,
      data: reels,
    });
  });

export const getReelByIdController =
  asyncHandler(async (req, res) => {
    const reel =
      await reelService.getReelById(
        req.user!.userId,
        req.params.id as string
      );

    res.json({
      success: true,
      data: reel,
    });
  });

export const updateReelController =
  asyncHandler(async (req, res) => {
    let videoUrl =
      req.body.videoUrl;

    if (req.file) {
      const result =
        await uploadVideo(req.file);

      videoUrl =
        result.secure_url;
    }

    const categoryId =
      req.body.categoryId === "__NULL__"
        ? null
        : req.body.categoryId;

    const data =
      updateReelSchema.parse({
        ...req.body,

        ...(videoUrl
          ? { videoUrl }
          : {}),

        ...(categoryId !== undefined
          ? { categoryId }
          : {}),

        ...(req.body.isPublished !== undefined
          ? {
              isPublished:
                req.body.isPublished === true ||
                req.body.isPublished === "true",
            }
          : {}),
      });

    const reel =
      await reelService.updateReel(
        req.params.id as string,
        data
      );

    res.json({
      success: true,

      message:
        "Reel muvaffaqiyatli yangilandi.",

      data: reel,
    });
  });

export const deleteReelController =
  asyncHandler(async (req, res) => {
    await reelService.deleteReel(
      req.params.id as string
    );

    res.json({
      success: true,
      message:
        "Reel muvaffaqiyatli o'chirildi.",
      data: null,
    });
  });

export const publishReelController =
  asyncHandler(async (req, res) => {
    const isPublished =
      req.body.isPublished === true ||
      req.body.isPublished === "true";

    const reel =
      await reelService.publishReel(
        req.params.id as string,
        isPublished
      );

    res.json({
      success: true,
      message: isPublished
        ? "Reel nashr qilindi."
        : "Reel draft holatiga qaytarildi.",
      data: reel,
    });
  });

export const toggleLikeController =
  asyncHandler(async (req, res) => {
    const result =
      await reelService.toggleLike(
        req.user!.userId,
        req.params.id as string
      );

    res.json({
      success: true,
      data: result,
    });
  });

export const createCommentController =
  asyncHandler(async (req, res) => {
    const data =
      createReelCommentSchema.parse(
        req.body
      );

    const comment =
      await reelService.createComment(
        req.user!.userId,
        req.params.id as string,
        data.text
      );

    res.status(201).json({
      success: true,
      message:
        "Izoh muvaffaqiyatli qo'shildi.",
      data: comment,
    });
  });

export const getCommentsController =
  asyncHandler(async (req, res) => {
    const comments =
      await reelService.getComments(
        req.params.id as string
      );

    res.json({
      success: true,
      data: comments,
    });
  });

export const deleteCommentController =
  asyncHandler(async (req, res) => {
    await reelService.deleteComment(
      req.user!.userId,
      req.params.commentId as string,
      req.user!.role
    );

    res.json({
      success: true,
      message:
        "Izoh o'chirildi.",
      data: null,
    });
  });
/*
|--------------------------------------------------------------------------
| Reel Categories
|--------------------------------------------------------------------------
*/

export const createCategoryController =
  asyncHandler(async (req, res) => {
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      const result =
        await uploadCategoryImage(req.file);

      imageUrl = result.secure_url;
    }

    const data =
      createReelCategorySchema.parse({
        name: req.body.name,
        slug: req.body.slug,
        description:
          req.body.description || undefined,
        imageUrl:
          imageUrl || undefined,
      });

    const category =
      await reelService.createCategory(data);

    res.status(201).json({
      success: true,
      message:
        "Kategoriya muvaffaqiyatli yaratildi.",
      data: category,
    });
  });


export const getCategoriesController =
  asyncHandler(async (_req, res) => {
    const categories =
      await reelService.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  });


export const getCategoryReelsController =
  asyncHandler(async (req, res) => {
    const result =
      await reelService.getCategoryReels(
        req.params.slug as string,
        req.user!.userId
      );

    res.json({
      success: true,
      data: result,
    });
  });


export const updateCategoryController =
  asyncHandler(async (req, res) => {
    let imageUrl: string | undefined;

    if (req.file) {
      const result =
        await uploadCategoryImage(req.file);

      imageUrl =
        result.secure_url;
    } else if (
      req.body.imageUrl !== undefined
    ) {
      imageUrl =
        req.body.imageUrl || undefined;
    }

    const data =
      updateReelCategorySchema.parse({
        ...(req.body.name !== undefined
          ? {
              name: req.body.name,
            }
          : {}),

        ...(req.body.slug !== undefined
          ? {
              slug: req.body.slug,
            }
          : {}),

        ...(req.body.description !== undefined
          ? {
              description:
                req.body.description || undefined,
            }
          : {}),

        ...(imageUrl !== undefined
          ? {
              imageUrl,
            }
          : {}),
      });

    const category =
      await reelService.updateCategory(
        req.params.id as string,
        data
      );

    res.json({
      success: true,

      message:
        "Kategoriya muvaffaqiyatli yangilandi.",

      data: category,
    });
  });

export const deleteCategoryController =
  asyncHandler(async (req, res) => {
    await reelService.deleteCategory(
      req.params.id as string
    );

    res.json({
      success: true,
      message:
        "Kategoriya o'chirildi.",
      data: null,
    });
  });



