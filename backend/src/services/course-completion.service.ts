import { prisma } from "../lib/prisma.js";

import * as completionRepository from "../repositories/course-completion.repository.js";

export const checkCourseCompletion = async (
  userId: string,
  courseId: string
) => {
  console.log(
    "========================================"
  );
  console.log(
    "=== COURSE COMPLETION CHECK STARTED ==="
  );
  console.log("userId:", userId);
  console.log("courseId:", courseId);

  // 1. Kursni olish
  const course =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        lessons: {
          include: {
            quiz: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

  if (!course) {
    console.log(
      "❌ Course not found"
    );

    return false;
  }

  console.log(
    "Course:",
    course.title
  );

  console.log(
    "Total lessons:",
    course.lessons.length
  );

  // 2. Barcha lessonlar completedmi?
  const completedLessons =
    await prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,
        lesson: {
          courseId,
        },
      },
    });

  console.log(
    "Completed lessons:",
    completedLessons
  );

  console.log(
    "Required lessons:",
    course.lessons.length
  );

  if (
    completedLessons !==
    course.lessons.length
  ) {
    console.log(
      "❌ Course completion stopped:"
    );

    console.log(
      "Not all lessons are completed."
    );

    console.log(
      "========================================"
    );

    return false;
  }

  console.log(
    "✅ All lessons completed"
  );

  // 3. Kursdagi quizlarni olish
  const quizzes =
    await completionRepository.getCourseQuizzes(
      courseId
    );

  console.log(
    "Course quizzes:",
    quizzes.map(
      (quiz) => quiz.id
    )
  );

  console.log(
    "Total quizzes:",
    quizzes.length
  );

  // 4. Quizlar mavjud bo'lsa,
  // hammasidan o'tilgan bo'lishi kerak
  if (quizzes.length > 0) {
    const passedQuizCount =
      await completionRepository.getPassedQuizCount(
        userId,
        quizzes.map(
          (quiz) => quiz.id
        )
      );

    console.log(
      "Passed quizzes:",
      passedQuizCount
    );

    console.log(
      "Required quizzes:",
      quizzes.length
    );

    if (
      passedQuizCount !==
      quizzes.length
    ) {
      console.log(
        "❌ Course completion stopped:"
      );

      console.log(
        "Not all quizzes are passed."
      );

      console.log(
        "========================================"
      );

      return false;
    }

    console.log(
      "✅ All quizzes passed"
    );
  } else {
    console.log(
      "ℹ️ Course has no quizzes"
    );
  }

  // 5. Completion oldin yaratilganmi?
  const existing =
    await completionRepository.findCompletion(
      userId,
      courseId
    );

  if (existing) {
    console.log(
      "✅ Course completion already exists"
    );

    console.log(
      "Completion ID:",
      existing.id
    );

    console.log(
      "========================================"
    );

    return true;
  }

  // 6. CourseCompletion yaratish
  console.log(
    "Creating course completion..."
  );

  const completion =
    await completionRepository.createCompletion(
      userId,
      courseId
    );

  console.log(
    "✅ Course completion created"
  );

  console.log(
    "Completion ID:",
    completion.id
  );

  // 7. Certificate yaratish
  console.log(
    "Generating certificate..."
  );

  const {
    generateCertificate,
  } = await import(
    "./certificate.service.js"
  );

  const certificate =
    await generateCertificate(
      userId,
      courseId
    );

  console.log(
    "✅ Certificate created"
  );

  console.log(
    "Certificate ID:",
    certificate.id
  );

  console.log(
    "Certificate No:",
    certificate.certificateNo
  );

  console.log(
    "=== COURSE COMPLETION FINISHED ==="
  );

  console.log(
    "========================================"
  );

  return true;
};

export const getCompletedCourses = async (
  userId: string
) => {
  const completions =
    await completionRepository.getCompletedCourses(
      userId
    );

  return completions.map(
    (item) => ({
      courseId: item.course.id,
      title: item.course.title,
      slug: item.course.slug,
      imageUrl:
        item.course.imageUrl,
      completedAt:
        item.completedAt,
    })
  );
};