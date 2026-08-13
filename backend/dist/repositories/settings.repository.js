import { prisma } from "../lib/prisma.js";
export const getSettings = () => {
    return prisma.siteSettings.findFirst();
};
export const createSettings = (data) => {
    return prisma.siteSettings.create({
        data,
    });
};
export const updateSettings = (id, data) => {
    return prisma.siteSettings.update({
        where: {
            id,
        },
        data,
    });
};
