import { useParams } from "react-router-dom";

import { useCourse } from "@/features/courses/hooks/useCourse";
import { useMyCourses } from "@/features/my-courses/hooks/useMyCourses";
import { useAuthStore } from "@/features/auth/store/auth.store";

import CourseHero from "@/features/courses/components/CourseHero";
import CourseStats from "@/features/courses/components/CourseStats";
import LessonList from "@/features/courses/components/LessonList";
import EnrollButton from "@/features/courses/components/EnrollButton";
import CourseReviews from "@/features/courses/components/CourseReviews";
import ReviewForm from "@/features/reviews/components/ReviewForm";

export default function CourseDetailsPage() {
  const { slug } = useParams();

  const { user } = useAuthStore();

  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourse(slug ?? "");

  /*
   * Faqat student uchun
   * "Mening kurslarim" endpointini chaqiramiz.
   *
   * Admin enrollment orqali tekshirilmaydi.
   */
  const isStudent =
    user?.role === "STUDENT";

  const {
    data: myCourses,
    isLoading: isMyCoursesLoading,
  } = useMyCourses(isStudent);

  if (
    isCourseLoading ||
    (isStudent && isMyCoursesLoading)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Kurs yuklanmoqda...
      </div>
    );
  }

  if (
    isCourseError ||
    !course
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Kurs topilmadi.
      </div>
    );
  }

  /*
   * Student kursga yozilganmi?
   *
   * Admin uchun enrollment tekshirilmaydi.
   */
  const enrollment =
    isStudent
      ? myCourses?.find(
          (item) =>
            item.course.id ===
            course.id
        )
      : undefined;

  const isEnrolled =
    Boolean(enrollment);

  const isCompleted =
    (enrollment?.course
      .completions?.length ?? 0) > 0;

  const hasReview =
    (enrollment?.course
      .reviews?.length ?? 0) > 0;

  return (
    <main className="min-h-full bg-slate-100 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8 px-6">

        <CourseHero
          course={course}
        />

        <CourseStats
          course={course}
        />

        <CourseReviews
          reviews={
            course.reviews ?? []
          }
          averageRating={
            course.averageRating
          }
          totalReviews={
            course._count.reviews
          }
        />

        {user ? (
          <>
            <LessonList
              lessons={
                course.lessons ?? []
              }
            />

            {isStudent && (
              <>
                <EnrollButton
                  courseId={course.id}
                  price={course.price}
                  isEnrolled={
                    isEnrolled
                  }
                />

                {/* Review */}
                {isEnrolled &&
                  isCompleted && (
                    <>
                      {hasReview ? (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                          <h2 className="text-xl font-bold text-green-800">
                            Kursga baho bergansiz
                          </h2>

                          <p className="mt-2 text-green-700">
                            Siz ushbu kurs
                            uchun allaqachon
                            baho va izoh
                            qoldirgansiz.
                          </p>
                        </div>
                      ) : (
                        <ReviewForm
                          courseId={
                            course.id
                          }
                        />
                      )}
                    </>
                  )}
              </>
            )}

            {user.role ===
              "ADMIN" && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h2 className="text-xl font-bold text-blue-800">
                  Admin rejimi
                </h2>

                <p className="mt-2 text-blue-700">
                  Siz ushbu kursni
                  administrator sifatida
                  ko‘rmoqdasiz.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-bold text-slate-900">
              Darslarni ko‘rish uchun
              tizimga kiring
            </h2>

            <p className="mt-2 text-slate-500">
              Kurs haqida ma'lumotlarni
              ko‘rishingiz mumkin. Darslar
              ro‘yxatini ko‘rish uchun
              tizimga kirishingiz kerak.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}