import { useNavigate } from "react-router-dom";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { useCourses } from "@/features/courses/hooks/useCourses";

export default function StudentCoursesPage() {
  const navigate = useNavigate();

  const {
    data: courses,
    isLoading,
    isError,
  } = useCourses();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          Kurslar yuklanmoqda...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-red-500">
          Kurslarni yuklab bo'lmadi.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Mavjud kurslar
          </h1>

          <p className="mt-2 text-base text-slate-500">
            O'zingizga mos kursni tanlang va o'qishni boshlang.
          </p>
        </div>

        {!courses || courses.length === 0 ? (
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-10 text-center">
              <p className="text-slate-500">
                Hozircha mavjud kurslar yo'q.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Rasm */}
                {course.imageUrl ? (
                  <div className="aspect-video overflow-hidden bg-slate-200">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-200">
                    <span className="text-slate-400">
                      Kurs rasmi mavjud emas
                    </span>
                  </div>
                )}

                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {course.title}
                    </CardTitle>

                    <Badge variant="success">
                      Mavjud
                    </Badge>
                  </div>

                  {course.category && (
                    <p className="text-sm text-slate-500">
                      {course.category}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-5">

                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <span>
                      {course.duration} soat
                    </span>

                    <span>
                      {course._count?.lessons ?? 0} dars
                    </span>

                    <span>
                      {course._count?.enrollments ?? 0} talaba
                    </span>
                  </div>

                  {/* Narx */}
                  <div>
                    <p className="text-xs text-slate-400">
                      Kurs narxi
                    </p>

                    <p className="text-xl font-bold text-slate-900">
                      {Number(course.price) === 0
                        ? "Bepul"
                        : `$${course.price}`}
                    </p>
                  </div>

                  {/* Tugmalar */}
                  <div className="grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/courses/${course.slug}`
                        )
                      }
                      className="rounded-xl border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Kursni ko'rish
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/courses/${course.slug}`
                        )
                      }
                      className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Kursga yozilish
                    </button>

                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}