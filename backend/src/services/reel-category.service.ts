import * as categoryRepository from "../repositories/reel-category.repository.js";

import { AppError } from "../utils/AppError.js";

import type {
  CreateReelCategoryInput,
  UpdateReelCategoryInput,
} from "../validators/reel-category.validator.js";

export const createCategory = async (
  data: CreateReelCategoryInput
) => {
  const existing =
    await categoryRepository.findCategoryBySlug(
      data.slug
    );

  if (existing) {
    throw new AppError(
      "Bu slug bilan kategoriya allaqachon mavjud.",
      409
    );
  }

  return categoryRepository.createCategory({
    name: data.name,
    slug: data.slug,
    description:
      data.description || undefined,
    imageUrl:
      data.imageUrl || undefined,
  });
};

export const getCategories = async () => {
  return categoryRepository.findAllCategories();
};

export const getCategoryBySlug = async (
  slug: string
) => {
  const category =
    await categoryRepository.findCategoryBySlug(
      slug
    );

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: UpdateReelCategoryInput
) => {
  const category =
    await categoryRepository.findCategoryById(
      id
    );

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  if (
    data.slug &&
    data.slug !== category.slug
  ) {
    const existing =
      await categoryRepository.findCategoryBySlug(
        data.slug
      );

    if (existing) {
      throw new AppError(
        "Bu slug bilan boshqa kategoriya mavjud.",
        409
      );
    }
  }

  return categoryRepository.updateCategory(
    id,
    {
      ...data,

      description:
        data.description || undefined,

      imageUrl:
        data.imageUrl || undefined,
    }
  );
};

export const deleteCategory = async (
  id: string
) => {
  const category =
    await categoryRepository.findCategoryById(
      id
    );

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  await categoryRepository.deleteCategory(
    id
  );
};

export const getCategoryReels = async (
  userId: string,
  slug: string
) => {
  const category =
    await categoryRepository.findCategoryBySlug(
      slug
    );

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  const reels =
    await categoryRepository.findPublishedReelsByCategory(
      slug
    );

  const result =
    await Promise.all(
      reels.map(async (reel) => {
        const { prisma } =
          await import("../lib/prisma.js");

        const like =
          await prisma.reelLike.findUnique({
            where: {
              userId_reelId: {
                userId,
                reelId: reel.id,
              },
            },
          });

        return {
          ...reel,

          likeCount:
            reel._count.likes,

          commentCount:
            reel._count.comments,

          likedByMe:
            Boolean(like),

          _count: undefined,
        };
      })
    );

  return {
    category,
    reels: result,
  };
};