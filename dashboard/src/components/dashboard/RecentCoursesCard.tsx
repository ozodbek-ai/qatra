import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

interface Props {
  courses: Course[];
}

export default function RecentCoursesCard({
  courses,
}: Props) {
  const navigate = useNavigate();

  const handleCourseClick = (
    courseId: string
  ) => {
    navigate(`/player/${courseId}`);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          Mening kurslarim
        </h2>

        {courses.length > 0 && (
          <button
            type="button"
            onClick={() =>
              navigate("/my-courses")
            }
            className="shrink-0 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Barchasini ko'rish
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-slate-500">
            Siz hali hech qaysi kursga yozilmagansiz.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/courses")
            }
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Kurslarni ko'rish
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() =>
                handleCourseClick(course.id)
              }
              className="group w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Rasm mavjud emas
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">
                        {course.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {course.completedLessons} /{" "}
                        {course.totalLessons} ta dars
                        yakunlangan
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-blue-600">
                      {course.progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            course.progress,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}