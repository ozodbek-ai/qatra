import { prisma } from "../lib/prisma.js";

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

export const findUsers = async (
  userId: string,
  search?: string
) => {
  const emailSearch = search?.trim();

  if (!emailSearch) {
    return [];
  }

  return prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },

      isActive: true,

      email: {
        contains: emailSearch,
        mode: "insensitive",
      },
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
    },

    orderBy: {
      email: "asc",
    },

    take: 20,
  });
};

/*
|--------------------------------------------------------------------------
| Conversations
|--------------------------------------------------------------------------
*/

/*
 * Aynan userId va otherUserId orasidagi
 * 1-to-1 conversationni topadi.
 *
 * some -> ikkala foydalanuvchi ham mavjud.
 * every -> conversation ichida boshqa foydalanuvchi yo'q.
 */
export const findConversationBetweenUsers = (
  userId: string,
  otherUserId: string
) => {
  return prisma.conversation.findFirst({
    where: {
      AND: [
        {
          members: {
            some: {
              userId,
            },
          },
        },

        {
          members: {
            some: {
              userId: otherUserId,
            },
          },
        },

        {
          members: {
            every: {
              userId: {
                in: [
                  userId,
                  otherUserId,
                ],
              },
            },
          },
        },
      ],
    },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

export const createConversation = async (
  userId: string,
  otherUserId: string
) => {
  return prisma.conversation.create({
    data: {
      members: {
        create: [
          {
            userId,
          },

          {
            userId: otherUserId,
          },
        ],
      },
    },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

/*
 * User conversation a'zosi ekanligini tekshiradi.
 */
export const findUserConversation = async (
  conversationId: string,
  userId: string
) => {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,

      members: {
        some: {
          userId,
        },
      },
    },
  });
};

export const getConversations = async (
  userId: string
) => {
  return prisma.conversation.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      },

      messages: {
        orderBy: {
          createdAt: "desc",
        },

        take: 1,

        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },

          reel: {
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              thumbnailUrl: true,
              isPublished: true,
            },
          },
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });
};

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

export const getMessages = async (
  conversationId: string
) => {
  return prisma.message.findMany({
    where: {
      conversationId,
    },

    orderBy: {
      createdAt: "asc",
    },

    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },

      reel: {
        select: {
          id: true,
          title: true,
          description: true,
          videoUrl: true,
          thumbnailUrl: true,
          isPublished: true,
        },
      },
    },
  });
};

export const createMessage = async (data: {
  conversationId: string;
  senderId: string;
  text?: string;
  reelId?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,

        text: data.text?.trim() || null,

        reelId: data.reelId || null,
      },

      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },

        reel: {
          select: {
            id: true,
            title: true,
            description: true,
            videoUrl: true,
            thumbnailUrl: true,
            isPublished: true,
          },
        },
      },
    });

    /*
     * Yangi message kelganda conversation ham update qilinadi.
     * Shunda updatedAt yangilanadi va chat tepaga chiqadi.
     */
    await tx.conversation.update({
      where: {
        id: data.conversationId,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  });
};

/*
|--------------------------------------------------------------------------
| Read status
|--------------------------------------------------------------------------
*/

export const markConversationAsRead = async (
  conversationId: string,
  userId: string
) => {
  return prisma.conversationMember.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },

    data: {
      lastReadAt: new Date(),
    },
  });
};

export const getUnreadMessageCount = async (
  conversationId: string,
  userId: string,
  lastReadAt: Date | null
) => {
  return prisma.message.count({
    where: {
      conversationId,

      senderId: {
        not: userId,
      },

      ...(lastReadAt
        ? {
            createdAt: {
              gt: lastReadAt,
            },
          }
        : {}),
    },
  });
};

/*
|--------------------------------------------------------------------------
| Socket helpers
|--------------------------------------------------------------------------
*/

export const getConversationMemberIds = async (
  conversationId: string
) => {
  const members =
    await prisma.conversationMember.findMany({
      where: {
        conversationId,
      },

      select: {
        userId: true,
      },
    });

  return members.map(
    (member) => member.userId
  );
};

export const getConversationMembers = async (
  conversationId: string
) => {
  return prisma.conversationMember.findMany({
    where: {
      conversationId,
    },

    select: {
      userId: true,
    },
  });
};