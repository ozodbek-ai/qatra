import { afterAll, beforeEach } from "vitest";
import { prisma } from "../src/lib/prisma.js";

beforeEach(async () => {
  await prisma.review.deleteMany();
  await prisma.courseCompletion.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});