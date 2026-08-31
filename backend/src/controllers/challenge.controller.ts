import type {
  Request,
  Response,
} from "express";

import { prisma } from "../lib/prisma.js";

import {
  completeChallenge,
} from "../services/challenge.service.js";

import { AppError } from "../utils/AppError.js";


/* =========================================
   HELPERS
========================================= */

const getChallengeId = (
  req: Request
): string => {
  const challengeId = req.params.challengeId;

  if (
    typeof challengeId !== "string" ||
    challengeId.trim().length === 0
  ) {
    throw new AppError(
      "Challenge ID noto'g'ri.",
      400
    );
  }

  return challengeId;
};


const handleError = (
  error: unknown,
  res: Response,
  fallbackMessage: string
) => {
  console.error(fallbackMessage, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};


/* =========================================
   CREATE CHALLENGE
========================================= */

export async function createChallenge(
  req: Request,
  res: Response
) {
  try {
    const challengerId = req.user?.userId;

    if (!challengerId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi autentifikatsiya qilinmagan.",
      });
    }

    const {
      opponentId,
      courseId,
    } = req.body;

    if (
      typeof opponentId !== "string" ||
      typeof courseId !== "string" ||
      opponentId.trim().length === 0 ||
      courseId.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Opponent va course tanlanishi kerak.",
      });
    }

    if (challengerId === opponentId) {
      return res.status(400).json({
        success: false,
        message:
          "O'zingiz bilan challenge qila olmaysiz.",
      });
    }

    const opponent =
      await prisma.user.findUnique({
        where: {
          id: opponentId,
        },
        select: {
          id: true,
          isActive: true,
        },
      });

    if (!opponent) {
      return res.status(404).json({
        success: false,
        message:
          "Foydalanuvchi topilmadi.",
      });
    }

    if (!opponent.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Bu foydalanuvchi faol emas.",
      });
    }

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          isActive: true,
          isPublished: true,
        },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Kurs topilmadi.",
      });
    }

    if (
      !course.isActive ||
      !course.isPublished
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bu kurs challenge uchun mavjud emas.",
      });
    }

        /*
     * =========================================
     * COURSE ENROLLMENT VALIDATION
     * =========================================
     */

    const [
      challengerEnrollment,
      opponentEnrollment,
    ] = await Promise.all([
      prisma.enrollment.findFirst({
        where: {
          userId: challengerId,
          courseId,
        },
      }),

      prisma.enrollment.findFirst({
        where: {
          userId: opponentId,
          courseId,
        },
      }),
    ]);


    /*
     * Challenge yuboruvchi kursga yozilganmi?
     */

    if (!challengerEnrollment) {
      return res.status(400).json({
        success: false,
        message:
          "Challenge yaratish uchun avval ushbu kursga yozilishingiz kerak.",
      });
    }


    /*
     * Raqib kursga yozilganmi?
     */

    if (!opponentEnrollment) {
      return res.status(400).json({
        success: false,
        message:
          "Tanlangan foydalanuvchi ushbu kursga yozilmagan.",
      });
    }

    const existingChallenge =
      await prisma.challenge.findFirst({
        where: {
          courseId,

          status: {
            in: [
              "PENDING",
              "ACCEPTED",
            ],
          },

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
        },
      });

    if (existingChallenge) {
      return res.status(409).json({
        success: false,
        message:
          "Bu foydalanuvchi bilan ushbu kurs bo'yicha faol challenge mavjud.",
      });
    }

    const challenge =
      await prisma.challenge.create({
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

    return res.status(201).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Challenge yaratishda xatolik yuz berdi."
    );
  }
}


/* =========================================
   GET MY CHALLENGES
========================================= */

export async function getMyChallenges(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi autentifikatsiya qilinmagan.",
      });
    }

    const challenges =
      await prisma.challenge.findMany({
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

winner: {
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

    return res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Challengelarni olishda xatolik yuz berdi."
    );
  }
}


/* =========================================
   ACCEPT CHALLENGE
========================================= */

export async function acceptChallenge(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi autentifikatsiya qilinmagan.",
      });
    }

    const challengeId =
      getChallengeId(req);

    const challenge =
      await prisma.challenge.findUnique({
        where: {
          id: challengeId,
        },
      });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge topilmadi.",
      });
    }

    if (challenge.opponentId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Bu challengeni qabul qilishga ruxsatingiz yo'q.",
      });
    }

        if (challenge.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Bu challenge endi PENDING holatda emas.",
      });
    }


    /*
     * Challenge qabul qilayotgan foydalanuvchi
     * hali ham kursga yozilganligini tekshirish
     */

    const opponentEnrollment =
      await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: challenge.courseId,
        },
      });


    if (!opponentEnrollment) {
      return res.status(400).json({
        success: false,
        message:
          "Challenge qabul qilish uchun avval ushbu kursga yozilgan bo'lishingiz kerak.",
      });
    }


    /*
     * Challenge yuborgan foydalanuvchi
     * hali ham kursga yozilganligini tekshirish
     */

    const challengerEnrollment =
      await prisma.enrollment.findFirst({
        where: {
          userId: challenge.challengerId,
          courseId: challenge.courseId,
        },
      });


    if (!challengerEnrollment) {
      return res.status(400).json({
        success: false,
        message:
          "Challenge yuborgan foydalanuvchi endi ushbu kursga yozilmagan.",
      });
    }


    const updatedChallenge =
      await prisma.challenge.update({
        where: {
          id: challengeId,
        },

        data: {
          status: "ACCEPTED",
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

    return res.json({
      success: true,
      data: updatedChallenge,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Challenge qabul qilishda xatolik yuz berdi."
    );
  }
}


/* =========================================
   DECLINE CHALLENGE
========================================= */

export async function declineChallenge(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi autentifikatsiya qilinmagan.",
      });
    }

    const challengeId =
      getChallengeId(req);

    const challenge =
      await prisma.challenge.findUnique({
        where: {
          id: challengeId,
        },
      });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge topilmadi.",
      });
    }

    if (challenge.opponentId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Bu challengeni rad etishga ruxsatingiz yo'q.",
      });
    }

    if (challenge.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Bu challenge endi PENDING holatda emas.",
      });
    }

    const updatedChallenge =
      await prisma.challenge.update({
        where: {
          id: challengeId,
        },

        data: {
          status: "DECLINED",
        },
      });

    return res.json({
      success: true,
      data: updatedChallenge,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Challenge rad etishda xatolik yuz berdi."
    );
  }
}


/* =========================================
   DELETE CHALLENGE
========================================= */

export async function deleteChallenge(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi autentifikatsiya qilinmagan.",
      });
    }

    const challengeId =
      getChallengeId(req);

    const challenge =
      await prisma.challenge.findUnique({
        where: {
          id: challengeId,
        },
      });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge topilmadi.",
      });
    }

    if (challenge.challengerId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Bu challengeni o'chirishga ruxsatingiz yo'q.",
      });
    }

    if (challenge.status === "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message:
          "Boshlangan challengeni o'chirib bo'lmaydi.",
      });
    }

    await prisma.challenge.delete({
      where: {
        id: challengeId,
      },
    });

    return res.json({
      success: true,
      message: "Challenge o'chirildi.",
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Challenge o'chirishda xatolik yuz berdi."
    );
  }
}


/* =========================================
   GET CHALLENGE PROGRESS
========================================= */

export async function getChallengeProgress(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi autentifikatsiya qilinmagan.",
      });
    }

    const challengeId =
      getChallengeId(req);

    const challenge =
      await prisma.challenge.findUnique({
        where: {
          id: challengeId,
        },
      });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge topilmadi.",
      });
    }

    const isParticipant =
      challenge.challengerId === userId ||
      challenge.opponentId === userId;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message:
          "Bu challenge ma'lumotlarini ko'rishga ruxsatingiz yo'q.",
      });
    }

    const updatedChallenge =
      await completeChallenge(
        challengeId
      );

    return res.json({
      success: true,
      data: updatedChallenge,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "Challenge progressini olishda xatolik yuz berdi."
    );
  }
}