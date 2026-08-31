import { Link } from "react-router-dom";

interface RecommendedCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  price: number;
  duration: number | null;
  level: string;
  totalLessons: number;
  averageRating: number;
  enrollmentCount: number;
}

interface Props {
  courses: RecommendedCourse[];
}

export default function RecommendedCoursesCard({
  courses,
}: Props) {
  if (courses.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Tavsiya etilgan kurslar
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Hozircha siz uchun tavsiya qilinadigan yangi kurslar mavjud emas.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Tavsiya etilgan kurslar
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Siz hali yozilmagan kurslardan tanlab oling.
          </p>
        </div>

        <Link
          to="/courses"
          className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Barchasini ko‘rish
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Link to={`/courses/${course.slug}`}>
              <div className="aspect-video overflow-hidden bg-slate-100">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Rasm mavjud emas
                  </div>
                )}
              </div>
            </Link>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                {course.category ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {course.category}
                  </span>
                ) : (
                  <span />
                )}

                <span className="text-xs font-medium text-slate-500">
                  {course.level}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                {course.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {course.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {course.totalLessons} ta dars
                </span>

                <span>
                  {course.duration ?? 0} soat
                </span>

                <span>
                  ★ {course.averageRating.toFixed(1)}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-900">
                  {course.price === 0
                    ? "Bepul"
                    : `${course.price.toLocaleString()} so‘m`}
                </span>

                <Link
                  to={`/courses/${course.slug}`}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Batafsil
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}