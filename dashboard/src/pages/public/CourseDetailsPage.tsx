import { useParams } from "react-router-dom";

import { useCourse } from "@/features/courses/hooks/useCourse";

import CourseHero from "@/features/courses/components/CourseHero";
import CourseStats from "@/features/courses/components/CourseStats";
import LessonList from "@/features/courses/components/LessonList";
import EnrollButton from "@/features/courses/components/EnrollButton";

export default function CourseDetailsPage() {
  const { slug } = useParams();

  const {
    data: course,
    isLoading,
    isError,
  } = useCourse(slug ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Kurs yuklanmoqda...
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Kurs topilmadi.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        <CourseHero course={course} />

        <CourseStats course={course} />

        <LessonList lessons={course.lessons} />

        <EnrollButton
    courseId={course.id}
    price={course.price}
/>
      </div>
    </main>
  );
}