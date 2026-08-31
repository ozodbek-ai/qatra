import { prisma } from "../lib/prisma.js";

export const findUserById = async (
  userId: string
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      isActive: true,
    },
  });
};

export const findCourseById = async (
  courseId: string
) => {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      isActive: true,
      isPublished: true,
    },

    select: {
      id: true,
      title: true,
      imageUrl: true,
    },
  });
};

export const findChallengeBetweenUsers = async (
  challengerId: string,
  opponentId: string,
  courseId: string
) => {
  return prisma.challenge.findFirst({
    where: {
      courseId,

      OR: [
        {
          challengerId,
          opponentId,
        },

        {
          challengerId: opponentId,
          opponentId: challengerId,
        },
      ],

      status: {
        in: [
          "PENDING",
          "ACCEPTED",
        ],
      },
    },
  });
};

export const createChallenge = async (
  challengerId: string,
  opponentId: string,
  courseId: string
) => {
  return prisma.challenge.create({
    data: {
      challengerId,
      opponentId,
      courseId,
    },

    include: {
      challenger: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      opponent: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
  });
};

export const getUserChallenges = async (
  userId: string
) => {
  return prisma.challenge.findMany({
    where: {
      OR: [
        {
          challengerId: userId,
        },

        {
          opponentId: userId,
        },
      ],
    },

    include: {
      challenger: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      opponent: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findChallengeById = async (
  challengeId: string
) => {
  return prisma.challenge.findUnique({
    where: {
      id: challengeId,
    },

    include: {
      challenger: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      opponent: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
  });
};

export const updateChallengeStatus = async (
  challengeId: string,
  status: "ACCEPTED" | "DECLINED"
) => {
  return prisma.challenge.update({
    where: {
      id: challengeId,
    },

    data: {
      status,
    },

    include: {
      challenger: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      opponent: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
  });
};