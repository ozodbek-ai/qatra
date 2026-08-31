import { prisma } from "../lib/prisma.js";

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
      createdAt: "desc",
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

    include: {
      _count: {
        select: {
          reels: true,
        },
      },
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

    include: {
      _count: {
        select: {
          reels: true,
        },
      },
    },
  });
};

export const updateCategory = (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
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

export const findPublishedReelsByCategory = (
  slug: string
) => {
  return prisma.reel.findMany({
    where: {
      isPublished: true,

      category: {
        slug,
      },
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