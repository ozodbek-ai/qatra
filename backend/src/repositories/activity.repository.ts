import { prisma } from "../lib/prisma.js";
import type { UserActivityType } from "../generated/prisma/enums.js";
import type { Prisma } from "../generated/prisma/client.js";

export const createUserActivity = (
  userId: string,
  type: UserActivityType,
  metadata?: Prisma.InputJsonValue
) => {
  return prisma.userActivity.create({
    data: {
      userId,
      type,
      metadata: metadata ?? undefined,
    },
  });
};

export const addActivityDuration = async (
  activityId: string,
  userId: string,
  durationSeconds: number
) => {
  if (
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0
  ) {
    return null;
  }

  const safeDuration = Math.min(
    Math.floor(durationSeconds),
    60
  );

  const result =
    await prisma.userActivity.updateMany({
      where: {
        id: activityId,
        userId,
        type: "LESSON_VIEW",
      },

      data: {
        durationSeconds: {
          increment: safeDuration,
        },

        endedAt: new Date(),
      },
    });

  if (result.count === 0) {
    return null;
  }

  return prisma.userActivity.findUnique({
    where: {
      id: activityId,
    },
  });
};