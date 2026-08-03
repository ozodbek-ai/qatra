import * as playerRepository from "../repositories/player.repository.js";
import { AppError } from "../utils/AppError.js";


export const getCoursePlayer = async (
  userId: string,
  courseId: string
) => {
    console.log("Player service started");
  console.log("Course ID:", courseId);

  const course =
    await playerRepository.findCourseWithLessons(
      courseId
    );
    console.log("Course loaded:", course);

  if (!course) {
    throw new AppError(
      "Kurs topilmadi.",
      404
    );
  }


  const lessonIds =
    course.lessons.map(
      (lesson) => lesson.id
    );
    console.log("LESSON IDS:", lessonIds);


  const completed =
    await playerRepository.findCompletedLessons(
      userId,
      lessonIds
    );
    console.log("COMPLETED:", completed);


  const completedIds = new Set(
    completed.map(
      (item) => item.lessonId
    )
  );
  console.log("LESSON IDS:", lessonIds);


  const lessons = course.lessons.map(
    (lesson) => ({
      ...lesson,
      completed:
        completedIds.has(lesson.id),
    })
  );


  const completedCount =
    completedIds.size;


  const progress =
    lessons.length === 0
      ? 0
      :
      Math.round(
        (completedCount /
        lessons.length) * 100
      );


  const nextLesson =
    lessons.find(
      (lesson) =>
        !lesson.completed
    );


  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
    },
    progress,
    completedLessons: [
      ...completedIds,
    ],
    lessons,
    nextLesson: nextLesson ?? null,
  };
};
