import { asyncHandler } from "../utils/asyncHandler.js";

import * as categoryService from "../services/reel-category.service.js";

import {
  createReelCategorySchema,
  updateReelCategorySchema,
} from "../validators/reel-category.validator.js";

export const createCategoryController =
  asyncHandler(async (req, res) => {
    const data =
      createReelCategorySchema.parse(
        req.body
      );

    const category =
      await categoryService.createCategory(
        data
      );

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
      await categoryService.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  });

export const getCategoryBySlugController =
  asyncHandler(async (req, res) => {
    const category =
      await categoryService.getCategoryBySlug(
        req.params.slug as string
      );

    res.json({
      success: true,
      data: category,
    });
  });

export const getCategoryReelsController =
  asyncHandler(async (req, res) => {
    const result =
      await categoryService.getCategoryReels(
        req.user!.userId,
        req.params.slug as string
      );

    res.json({
      success: true,
      data: result,
    });
  });

export const updateCategoryController =
  asyncHandler(async (req, res) => {
    const data =
      updateReelCategorySchema.parse(
        req.body
      );

    const category =
      await categoryService.updateCategory(
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
    await categoryService.deleteCategory(
      req.params.id as string
    );

    res.json({
      success: true,

      message:
        "Kategoriya muvaffaqiyatli o'chirildi.",

      data: null,
    });
  });