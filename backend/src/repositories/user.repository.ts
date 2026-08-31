import { prisma } from "../lib/prisma.js";
import type { UserQueryInput } from "../validators/user.validator.js";
import type { UserRole } from "../generated/prisma/enums.js";

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

      activities: {
        orderBy: {
          startedAt: "desc",
        },

        take: 100,
      },
    },
  });
};

export const getUserRoleById = (
  userId: string
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      role: true,
    },
  });
};

export const updateUserRole = (
  userId: string,
  role: UserRole
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

export const getUserActivityStats = async (
  userId: string,
  startOfToday: Date,
  startOfWeek: Date,
  startOfMonth: Date
) => {
  const [
    todayLogins,
    weekLogins,
    monthLogins,
    todayLessonDuration,
    weekLessonDuration,
    monthLessonDuration,
    totalLessonsViewed,
    totalLessonDuration,
    weeklyLoginActivities,
  ] = await Promise.all([
    prisma.userActivity.count({
      where: {
        userId,
        type: "LOGIN",
        startedAt: {
          gte: startOfToday,
        },
      },
    }),

    prisma.userActivity.count({
      where: {
        userId,
        type: "LOGIN",
        startedAt: {
          gte: startOfWeek,
        },
      },
    }),

    prisma.userActivity.count({
      where: {
        userId,
        type: "LOGIN",
        startedAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.userActivity.aggregate({
      where: {
        userId,
        type: "LESSON_VIEW",
        startedAt: {
          gte: startOfToday,
        },
      },

      _sum: {
        durationSeconds: true,
      },
    }),

    prisma.userActivity.aggregate({
      where: {
        userId,
        type: "LESSON_VIEW",
        startedAt: {
          gte: startOfWeek,
        },
      },

      _sum: {
        durationSeconds: true,
      },
    }),

    prisma.userActivity.aggregate({
      where: {
        userId,
        type: "LESSON_VIEW",
        startedAt: {
          gte: startOfMonth,
        },
      },

      _sum: {
        durationSeconds: true,
      },
    }),

    prisma.userActivity.count({
      where: {
        userId,
        type: "LESSON_VIEW",
      },
    }),

    prisma.userActivity.aggregate({
      where: {
        userId,
        type: "LESSON_VIEW",
      },

      _sum: {
        durationSeconds: true,
      },
    }),

    prisma.userActivity.findMany({
      where: {
        userId,
        type: "LOGIN",
        startedAt: {
          gte: startOfWeek,
        },
      },

      select: {
        startedAt: true,
      },

      orderBy: {
        startedAt: "asc",
      },
    }),
  ]);

  /*
   * Haftaning 7 kunlik login indikatori.
   *
   * JavaScript:
   * 0 = Yakshanba
   * 1 = Dushanba
   * ...
   * 6 = Shanba
   *
   * Bizning UI:
   * Dushanba → Yakshanba
   */

  const loginDays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(
        startOfWeek
      );

      date.setDate(
        startOfWeek.getDate() + index
      );

      const dateKey =
        date.toISOString().slice(0, 10);

      const loggedIn =
        weeklyLoginActivities.some(
          (activity) => {
            const activityDate =
              new Date(
                activity.startedAt
              );

            return (
              activityDate
                .toISOString()
                .slice(0, 10) ===
              dateKey
            );
          }
        );

      return {
        date: dateKey,

        dayIndex: index,

        day:
          [
            "Du",
            "Se",
            "Ch",
            "Pa",
            "Ju",
            "Sh",
            "Ya",
          ][index],

        loggedIn,
      };
    }
  );

  return {
    logins: {
      today: todayLogins,
      week: weekLogins,
      month: monthLogins,
    },

    loginDays,

    lessonDuration: {
      today:
        todayLessonDuration._sum
          .durationSeconds ?? 0,

      week:
        weekLessonDuration._sum
          .durationSeconds ?? 0,

      month:
        monthLessonDuration._sum
          .durationSeconds ?? 0,

      total:
        totalLessonDuration._sum
          .durationSeconds ?? 0,
    },

    totalLessonsViewed,
  };
};