import * as reelRepository from "../repositories/reel.repository.js";

import { AppError } from "../utils/AppError.js";

import type {
  CreateReelInput,
  UpdateReelInput,
  CreateReelCategoryInput,
  UpdateReelCategoryInput,
} from "../validators/reel.validator.js";

export const createReel = async (
  data: CreateReelInput
) => {
  if (data.categoryId) {
    const category =
      await reelRepository.findCategoryById(
        data.categoryId
      );

    if (!category) {
      throw new AppError(
        "Reel kategoriyasi topilmadi.",
        404
      );
    }
  }

  return reelRepository.createReel({
    title: data.title,

    description:
      data.description || undefined,

    videoUrl: data.videoUrl,

    thumbnailUrl:
      data.thumbnailUrl || undefined,

    isPublished:
      data.isPublished ?? false,

    categoryId:
      data.categoryId || undefined,
  });
};

export const getPublishedReels = async (
  userId: string
) => {
  const reels =
    await reelRepository.findPublishedReels();

  const result =
    await Promise.all(
      reels.map(async (reel) => {
        const like =
          await reelRepository.findLike(
            userId,
            reel.id
          );

        return {
          ...reel,
          likeCount:
            reel._count.likes,
          commentCount:
            reel._count.comments,
          likedByMe: Boolean(like),
          _count: undefined,
        };
      })
    );

  return result;
};

export const getAllReels = () => {
  return reelRepository.findAllReels();
};

export const getReelById = async (
  userId: string,
  reelId: string
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  const like =
    await reelRepository.findLike(
      userId,
      reel.id
    );

  return {
    ...reel,
    likeCount:
      reel._count.likes,
    commentCount:
      reel._count.comments,
    likedByMe: Boolean(like),
    _count: undefined,
  };
};

export const updateReel = async (
  reelId: string,
  data: UpdateReelInput
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  if (data.categoryId) {
    const category =
      await reelRepository.findCategoryById(
        data.categoryId
      );

    if (!category) {
      throw new AppError(
        "Reel kategoriyasi topilmadi.",
        404
      );
    }
  }

  return reelRepository.updateReel(
    reelId,
    {
      ...(data.title !== undefined
        ? {
            title: data.title,
          }
        : {}),

      ...(data.description !== undefined
        ? {
            description:
              data.description || undefined,
          }
        : {}),

      ...(data.videoUrl !== undefined
        ? {
            videoUrl: data.videoUrl,
          }
        : {}),

      ...(data.thumbnailUrl !== undefined
        ? {
            thumbnailUrl:
              data.thumbnailUrl || undefined,
          }
        : {}),

      ...(data.isPublished !== undefined
        ? {
            isPublished:
              data.isPublished,
          }
        : {}),

      ...(data.categoryId !== undefined
        ? {
            categoryId:
              data.categoryId,
          }
        : {}),
    }
  );
};

export const deleteReel = async (
  reelId: string
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  await reelRepository.deleteReel(
    reelId
  );
};

export const publishReel = async (
  reelId: string,
  isPublished: boolean
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  return reelRepository.updatePublishStatus(
    reelId,
    isPublished
  );
};

export const toggleLike = async (
  userId: string,
  reelId: string
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  const existingLike =
    await reelRepository.findLike(
      userId,
      reelId
    );

  if (existingLike) {
    await reelRepository.deleteLike(
      userId,
      reelId
    );
  } else {
    await reelRepository.createLike(
      userId,
      reelId
    );
  }

  const likeCount =
    await reelRepository.getLikeCount(
      reelId
    );

  return {
    liked: !existingLike,
    likeCount,
  };
};

export const createComment = async (
  userId: string,
  reelId: string,
  text: string
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  return reelRepository.createComment(
    userId,
    reelId,
    text
  );
};

export const getComments = async (
  reelId: string
) => {
  const reel =
    await reelRepository.findReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi.",
      404
    );
  }

  return reelRepository.getComments(
    reelId
  );
};

export const deleteComment = async (
  userId: string,
  commentId: string,
  role: string
) => {
  const comment =
    await reelRepository.findCommentById(
      commentId
    );

  if (!comment) {
    throw new AppError(
      "Izoh topilmadi.",
      404
    );
  }

  if (
    comment.userId !== userId &&
    role !== "ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {
    throw new AppError(
      "Bu izohni o'chirishga ruxsatingiz yo'q.",
      403
    );
  }

  await reelRepository.deleteComment(
    commentId
  );
};

export const getPublishedReelById = async (
  reelId: string,
  userId: string
) => {
  const reel =
    await reelRepository.findPublishedReelById(
      reelId
    );

  if (!reel) {
    throw new AppError(
      "Reel topilmadi yoki nashr qilinmagan.",
      404
    );
  }

  const like =
    await reelRepository.findLike(
      userId,
      reel.id
    );

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
};



export const createCategory = async (
  data: CreateReelCategoryInput
) => {
  const existing =
    await reelRepository.findCategoryBySlug(
      data.slug
    );

  if (existing) {
    throw new AppError(
      "Bu slug bilan kategoriya mavjud.",
      409
    );
  }

  return reelRepository.createCategory({
    name: data.name.trim(),

    slug: data.slug.trim(),

    description:
      data.description || undefined,

    imageUrl:
      data.imageUrl || undefined,
  });
};

export const getCategories = async () => {
  return reelRepository.findAllCategories();
};

export const getCategoryReels = async (
  slug: string,
  userId: string
) => {
  const category =
    await reelRepository.findCategoryBySlug(
      slug
    );

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  const reels =
    await reelRepository.findPublishedReelsByCategory(
      category.id
    );

  const result =
    await Promise.all(
      reels.map(async (reel) => {
        const like =
          await reelRepository.findLike(
            userId,
            reel.id
          );

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

export const updateCategory = async (
  id: string,
  data: UpdateReelCategoryInput
) => {
  const category =
    await reelRepository.findCategoryById(id);

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  if (data.slug !== undefined) {
    const existing =
      await reelRepository.findCategoryBySlug(
        data.slug
      );

    if (
      existing &&
      existing.id !== id
    ) {
      throw new AppError(
        "Bu slug allaqachon ishlatilgan.",
        409
      );
    }
  }

  return reelRepository.updateCategory(
    id,
    {
      ...(data.name !== undefined
        ? {
            name: data.name.trim(),
          }
        : {}),

      ...(data.slug !== undefined
        ? {
            slug: data.slug.trim(),
          }
        : {}),

      ...(data.description !== undefined
        ? {
            description:
              data.description || null,
          }
        : {}),

      ...(data.imageUrl !== undefined
        ? {
            imageUrl:
              data.imageUrl || null,
          }
        : {}),
    }
  );
};

export const deleteCategory = async (
  id: string
) => {
  const category =
    await reelRepository.findCategoryById(id);

  if (!category) {
    throw new AppError(
      "Kategoriya topilmadi.",
      404
    );
  }

  await reelRepository.deleteCategory(id);
};