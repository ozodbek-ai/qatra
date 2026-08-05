import { useMyCourses } from "@/features/my-courses/hooks/useMyCourses";

import CourseCard from "@/features/my-courses/components/CourseCard";

export default function MyCoursesPage() {
  const { data, isLoading, isError } =
    useMyCourses();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Kurslarni yuklab bo'lmadi.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">
          Mening kurslarim
        </h1>

        {data.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <p className="text-slate-600">
              Siz hali hech qaysi kursga yozilmagansiz.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}