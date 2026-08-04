import { prisma } from "../lib/prisma.js";
export const findByCompletion = (completionId) => {
    return prisma.certificate.findUnique({
        where: {
            completionId,
        },
    });
};
export const createCertificate = (userId, courseId, completionId, certificateNo) => {
    return prisma.certificate.create({
        data: {
            userId,
            courseId,
            completionId,
            certificateNo,
        },
    });
};
export const findByCertificateNo = (certificateNo) => {
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
export const getUserCertificates = (userId) => {
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
