import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.course.createMany({
  data: [
    {
      title: "Flutter Asoslari",
      slug: "flutter-asoslari",
      description: "Flutter yordamida mobil ilovalar yaratish.",
      lessons: 24,
      price: 199000,
      level: "BEGINNER",
      isPublished: true,
    },
    {
      title: "Node.js Backend",
      slug: "nodejs-backend",
      description: "Express va Prisma bilan backend.",
      lessons: 31,
      price: 249000,
      level: "INTERMEDIATE",
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