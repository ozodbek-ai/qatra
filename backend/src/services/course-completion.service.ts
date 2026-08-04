import { prisma } from "../lib/prisma.js";
import * as completionRepository from "../repositories/course-completion.repository.js";

export const checkCourseCompletion = async (
  userId: string,
  courseId: string
) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        include: {
          quiz: true,
        },
      },
    },
  });

  if (!course) {
    return false;
  }

  // 1. Barcha lessonlar tugaganmi?
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
      lesson: {
        courseId,
      },
    },
  });

  if (completedLessons !== course.lessons.length) {
    return false;
  }

  // 2. Kursdagi barcha quizlarni olish
  const quizzes =
    await completionRepository.getCourseQuizzes(
      courseId
    );

  // 3. Agar quiz mavjud bo'lsa, hammasi topshirilgan bo'lishi kerak
  if (quizzes.length > 0) {
    const passedQuizCount =
      await completionRepository.getPassedQuizCount(
        userId,
        quizzes.map((quiz) => quiz.id)
      );

    if (passedQuizCount !== quizzes.length) {
      return false;
    }
  }

  // 4. Completion oldin yaratilganmi?
  const existing =
    await completionRepository.findCompletion(
      userId,
      courseId
    );

  if (existing) {
    return true;
  }

  // 5. Completion yaratish

  await completionRepository.createCompletion(
  userId,
  courseId
);

const {
  generateCertificate,
} = await import("./certificate.service.js");

await generateCertificate(
  userId,
  courseId
);

return true;
}

export const getCompletedCourses = async (
  userId: string
) => {
  const completions =
    await completionRepository.getCompletedCourses(
      userId
    );

  return completions.map((item) => ({
    courseId: item.course.id,
    title: item.course.title,
    slug: item.course.slug,
    imageUrl: item.course.imageUrl,
    completedAt: item.completedAt,
  }));
};