import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.course.createMany({
    data: [
      {
        title: "Flutter Asoslari",
        description: "Flutter yordamida mobil ilovalar yaratish kursi.",
        lessons: 24,
        isPublished: true,
      },
      {
        title: "Node.js Backend",
        description: "Node.js va Express bilan backend dasturlash.",
        lessons: 31,
        isPublished: true,
      },
    ],
  });

  console.log("✅ Kurslar qo'shildi.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });