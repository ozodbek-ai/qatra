import { prisma } from "../lib/prisma.js";

async function getCourseProgressPercentage(
  userId: string,
  courseId: string
): Promise<number> {
  const totalLessons =
    await prisma.lesson.count({
      where: {
        courseId,
        isPublished: true,
      },
    });

  if (totalLessons === 0) {
    return 0;
  }

  const completedLessons =
    await prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,

        lesson: {
          courseId,
          isPublished: true,
        },
      },
    });

  return Math.round(
    (completedLessons / totalLessons) * 100
  );
}


export async function updateChallengeScores(
  challengeId: string
) {
  const challenge =
    await prisma.challenge.findUnique({
      where: {
        id: challengeId,
      },
    });

  if (!challenge) {
    throw new Error(
      "Challenge topilmadi."
    );
  }

  const challengerScore =
    await getCourseProgressPercentage(
      challenge.challengerId,
      challenge.courseId
    );

  const opponentScore =
    await getCourseProgressPercentage(
      challenge.opponentId,
      challenge.courseId
    );

  const now = new Date();

  const challengerCompletedAt =
    challengerScore >= 100 &&
    !challenge.challengerCompletedAt
      ? now
      : challenge.challengerCompletedAt;

  const opponentCompletedAt =
    opponentScore >= 100 &&
    !challenge.opponentCompletedAt
      ? now
      : challenge.opponentCompletedAt;

  return prisma.challenge.update({
    where: {
      id: challengeId,
    },

    data: {
      challengerScore,
      opponentScore,

      challengerCompletedAt,
      opponentCompletedAt,
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
  });
}


export async function completeChallenge(
  challengeId: string
) {
  const challenge =
    await updateChallengeScores(
      challengeId
    );

  /*
   * Challenge faqat ACCEPTED
   * holatida tugatilishi mumkin
   */
  if (
    challenge.status !== "ACCEPTED"
  ) {
    return challenge;
  }

  const challengerCompleted =
    challenge.challengerScore >= 100;

  const opponentCompleted =
    challenge.opponentScore >= 100;

  /*
   * Hali hech kim kursni tugatmagan
   */
  if (
    !challengerCompleted &&
    !opponentCompleted
  ) {
    return challenge;
  }

  let winnerId: string | null = null;

  /*
   * Faqat challenger tugatgan
   */
  if (
    challengerCompleted &&
    !opponentCompleted
  ) {
    winnerId =
      challenge.challengerId;
  }

  /*
   * Faqat opponent tugatgan
   */
  else if (
    opponentCompleted &&
    !challengerCompleted
  ) {
    winnerId =
      challenge.opponentId;
  }

  /*
   * Ikkalasi ham tugatgan
   */
  else if (
    challengerCompleted &&
    opponentCompleted
  ) {
    const challengerTime =
      challenge.challengerCompletedAt
        ?.getTime() ?? Date.now();

    const opponentTime =
      challenge.opponentCompletedAt
        ?.getTime() ?? Date.now();

    if (
      challengerTime < opponentTime
    ) {
      winnerId =
        challenge.challengerId;
    } else if (
      opponentTime < challengerTime
    ) {
      winnerId =
        challenge.opponentId;
    }
  }

  return prisma.challenge.update({
    where: {
      id: challengeId,
    },

    data: {
      status: "COMPLETED",

      winnerId,
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
  });
}

export async function updateUserCourseChallenges(
  userId: string,
  courseId: string
) {
  const challenges =
    await prisma.challenge.findMany({
      where: {
        courseId,
        status: "ACCEPTED",

        OR: [
          {
            challengerId: userId,
          },
          {
            opponentId: userId,
          },
        ],
      },

      select: {
        id: true,
      },
    });

  const updatedChallenges = [];

  for (const challenge of challenges) {
    const result =
      await completeChallenge(
        challenge.id
      );

    updatedChallenges.push(result);
  }

  return updatedChallenges;
}