import { prisma } from "../lib/prisma.js";
import type { UserQueryInput } from "../validators/user.validator.js";

export const getUsers = async (
  query: UserQueryInput
) => {

  const {
    page,
    limit,
    search,
    role,
    isActive,
  } = query;

  const where = {

    ...(search && {
      OR: [
        {
          fullName: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),

    ...(role && {
      role,
    }),

    ...(typeof isActive === "boolean" && {
      isActive,
    }),

  };

  const [users, total] =
    await prisma.$transaction([

      prisma.user.findMany({

        where,

        skip:
          (page - 1) * limit,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          enrollments: true,
          certificates: true,
        },

      }),

      prisma.user.count({
        where,
      }),

    ]);

  return {

    users,

    total,

    page,

    limit,

    totalPages:
      Math.ceil(total / limit),

  };

};

export const getUserById = (
  userId: string
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      certificates: {
        include: {
          course: true,
        },
      },
      quizAttempts: true,
      lessonProgress: true,
    },
  });
};

export const updateUserRole = (
  userId: string,
  role: "ADMIN" | "STUDENT"
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
};

export const updateUserStatus = (
  userId: string,
  isActive: boolean
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
  });
};
export const getMyProfile = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      avatarUrl: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateMyProfile = (
  userId: string,
  data: {
    fullName?: string;
    avatarUrl?: string | null;
  }
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data,
    
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      avatarUrl: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getUserPassword = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      password: true,
    },
  });
};

export const updateUserPassword = (
  userId: string,
  password: string
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      password,
    },
  });
};
export const findUserByIdForPassword = (
  userId: string
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
    },
  });
};

export const updatePassword = (
  userId: string,
  password: string
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
};