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