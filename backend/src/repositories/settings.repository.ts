import { prisma } from "../lib/prisma.js";

export const getSettings = () => {
  return prisma.siteSettings.findFirst();
};

export const createSettings = (data: {
  platformName: string;
  description: string;
  logoUrl?: string | null;
  supportEmail?: string | null;
  defaultQuizPassPercentage: number;
}) => {
  return prisma.siteSettings.create({
    data,
  });
};

export const updateSettings = (
  id: string,
  data: {
    platformName?: string;
    description?: string;
    logoUrl?: string | null;
    supportEmail?: string | null;
    defaultQuizPassPercentage?: number;
  }
) => {
  return prisma.siteSettings.update({
    where: {
      id,
    },
    data,
  });
};