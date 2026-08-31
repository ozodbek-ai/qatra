import { prisma } from "../lib/prisma.js";

export const createReel = (
  data: {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    isPublished?: boolean;
    categoryId?: string;
  }
) => {
  return prisma.reel.create({
    data,
  });
};

export const findReelById = (
  id: string
) => {
  return prisma.reel.findUnique({
    where: {
      id,
    },

    include: {
      category: true,

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
};

export const findPublishedReels = () => {
  return prisma.reel.findMany({
    where: {
      isPublished: true,
    },

    include: {
      category: true,

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findAllReels = () => {
  return prisma.reel.findMany({
    include: {
      category: true,

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateReel = (
  id: string,
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    isPublished?: boolean;
    categoryId?: string | null;
  }
) => {
  return prisma.reel.update({
    where: {
      id,
    },

    data,
  });
};

export const deleteReel = (
  id: string
) => {
  return prisma.reel.delete({
    where: {
      id,
    },
  });
};

export const updatePublishStatus = (
  id: string,
  isPublished: boolean
) => {
  return prisma.reel.update({
    where: {
      id,
    },

    data: {
      isPublished,
    },
  });
};

export const findLike = (
  userId: string,
  reelId: string
) => {
  return prisma.reelLike.findUnique({
    where: {
      userId_reelId: {
        userId,
        reelId,
      },
    },
  });
};

export const createLike = (
  userId: string,
  reelId: string
) => {
  return prisma.reelLike.create({
    data: {
      userId,
      reelId,
    },
  });
};

export const deleteLike = (
  userId: string,
  reelId: string
) => {
  return prisma.reelLike.delete({
    where: {
      userId_reelId: {
        userId,
        reelId,
      },
    },
  });
};

export const getLikeCount = (
  reelId: string
) => {
  return prisma.reelLike.count({
    where: {
      reelId,
    },
  });
};

export const createComment = (
  userId: string,
  reelId: string,
  text: string
) => {
  return prisma.reelComment.create({
    data: {
      userId,
      reelId,
      text,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });
};

export const getComments = (
  reelId: string
) => {
  return prisma.reelComment.findMany({
    where: {
      reelId,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

export const deleteComment = (
  commentId: string
) => {
  return prisma.reelComment.delete({
    where: {
      id: commentId,
    },
  });
};

export const findCommentById = (
  commentId: string
) => {
  return prisma.reelComment.findUnique({
    where: {
      id: commentId,
    },
  });
};

export const findPublishedReelById = (
  id: string
) => {
  return prisma.reel.findFirst({
    where: {
      id,
      isPublished: true,
    },

    include: {
      category: true,

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
};

export const createCategory = (
  data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
  }
) => {
  return prisma.reelCategory.create({
    data,
  });
};

export const findAllCategories = () => {
  return prisma.reelCategory.findMany({
    include: {
      _count: {
        select: {
          reels: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
};

export const findCategoryById = (
  id: string
) => {
  return prisma.reelCategory.findUnique({
    where: {
      id,
    },
  });
};

export const findCategoryBySlug = (
  slug: string
) => {
  return prisma.reelCategory.findUnique({
    where: {
      slug,
    },
  });
};

export const findPublishedReelsByCategory = (
  categoryId: string
) => {
  return prisma.reel.findMany({
    where: {
      categoryId,
      isPublished: true,
    },

    include: {
      category: true,

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateCategory = (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
  }
) => {
  return prisma.reelCategory.update({
    where: {
      id,
    },

    data,
  });
};

export const deleteCategory = (
  id: string
) => {
  return prisma.reelCategory.delete({
    where: {
      id,
    },
  });
};