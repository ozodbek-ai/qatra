import { prisma } from "../lib/prisma.js";

export const findByCompletion = (
  completionId: string
) => {
  return prisma.certificate.findUnique({
    where: {
      completionId,
    },
  });
};

export const createCertificate = (
  userId: string,
  courseId: string,
  completionId: string,
  certificateNo: string
) => {
  return prisma.certificate.create({
    data: {
      userId,
      courseId,
      completionId,
      certificateNo,
    },
  });
};

export const findByCertificateNo = (
  certificateNo: string
) => {
  return prisma.certificate.findUnique({
    where: {
      certificateNo,
    },
    include: {
      user: true,
      course: true,
    },
  });
};

export const getUserCertificates = (
  userId: string
) => {
  return prisma.certificate.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
    orderBy: {
      issuedAt: "desc",
    },
  });
};

export const findByIdForUser = (
  certificateId: string,
  userId: string
) => {
  return prisma.certificate.findFirst({
    where: {
      id: certificateId,
      userId,
    },
    include: {
      user: {
        select: {
          fullName: true,
        },
      },

      course: {
        select: {
          title: true,
        },
      },
    },
  });
};

export const getAdminCertificateStatistics = async (
  periods: {
    today: Date;
    week: Date;
    month: Date;
  }
) => {
  const [
    totalCertificates,
    totalRecipients,
    todayCertificates,
    todayRecipients,
    weekCertificates,
    weekRecipients,
    monthCertificates,
    monthRecipients,
    recentCertificates,
    courseCertificates,
  ] = await Promise.all([
    prisma.certificate.count(),

    prisma.certificate.groupBy({
      by: ["userId"],
    }),

    prisma.certificate.count({
      where: {
        issuedAt: {
          gte: periods.today,
        },
      },
    }),

    prisma.certificate.groupBy({
      by: ["userId"],
      where: {
        issuedAt: {
          gte: periods.today,
        },
      },
    }),

    prisma.certificate.count({
      where: {
        issuedAt: {
          gte: periods.week,
        },
      },
    }),

    prisma.certificate.groupBy({
      by: ["userId"],
      where: {
        issuedAt: {
          gte: periods.week,
        },
      },
    }),

    prisma.certificate.count({
      where: {
        issuedAt: {
          gte: periods.month,
        },
      },
    }),

    prisma.certificate.groupBy({
      by: ["userId"],
      where: {
        issuedAt: {
          gte: periods.month,
        },
      },
    }),

    prisma.certificate.findMany({
      take: 10,

      orderBy: {
        issuedAt: "desc",
      },

      select: {
        id: true,
        certificateNo: true,
        issuedAt: true,

        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },

        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),

    prisma.certificate.findMany({
      select: {
        courseId: true,

        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
  ]);

  const courseMap = new Map<
    string,
    {
      id: string;
      title: string;
      count: number;
    }
  >();

  for (const certificate of courseCertificates) {
    const existing =
      courseMap.get(
        certificate.courseId
      );

    if (existing) {
      existing.count += 1;
    } else {
      courseMap.set(
        certificate.courseId,
        {
          id: certificate.course.id,
          title:
            certificate.course.title,
          count: 1,
        }
      );
    }
  }

  const topCourses = Array.from(
    courseMap.values()
  )
    .sort(
      (a, b) =>
        b.count - a.count
    )
    .slice(0, 5);

  return {
    statistics: {
      totalCertificates,
      totalRecipients:
        totalRecipients.length,

      todayCertificates,
      todayRecipients:
        todayRecipients.length,

      weekCertificates,
      weekRecipients:
        weekRecipients.length,

      monthCertificates,
      monthRecipients:
        monthRecipients.length,
    },

    recentCertificates,

    topCourses,
  };
};