import { prisma } from "../config/prisma";

export const getCourses = async () => {
  return await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};