import { useParams } from "react-router-dom";

import { useCourse } from "@/features/courses/hooks/useCourse";
import { useMyCourses } from "@/features/my-courses/hooks/useMyCourses";
import { useAuthStore } from "@/features/auth/store/auth.store";

import CourseHero from "@/features/courses/components/CourseHero";
import CourseStats from "@/features/courses/components/CourseStats";
import LessonList from "@/features/courses/components/LessonList";
import EnrollButton from "@/features/courses/components/EnrollButton";

export default function CourseDetailsPage() {
  const { slug } = useParams();

  const { user } = useAuthStore();

  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourse(slug ?? "");

  const {
    data: myCourses,
    isLoading: isMyCoursesLoading,
  } = useMyCourses(Boolean(user));

  if (
    isCourseLoading ||
    (Boolean(user) && isMyCoursesLoading)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Kurs yuklanmoqda...
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Kurs topilmadi.
      </div>
    );
  }

  const isEnrolled =
    myCourses?.some(
      (enrollment) =>
        enrollment.course.id === course.id
    ) ?? false;

  return (
    <main className="min-h-full bg-slate-100 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        <CourseHero course={course} />

        <CourseStats course={course} />

        {user ? (
          <>
            <LessonList
              lessons={course.lessons ?? []}
            />

            <EnrollButton
              courseId={course.id}
              price={course.price}
              isEnrolled={isEnrolled}
            />
          </>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-bold text-slate-900">
              Darslarni ko‘rish uchun tizimga kiring
            </h2>

            <p className="mt-2 text-slate-500">
              Kurs haqida ma'lumotlarni ko‘rishingiz mumkin.
              Darslar ro‘yxatini ko‘rish uchun tizimga
              kirishingiz kerak.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}