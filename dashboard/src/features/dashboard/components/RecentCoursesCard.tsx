import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Mening kurslarim
        </h2>

        {courses.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/my-courses")}
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
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
            onClick={() => navigate("/courses")}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Kurslarni ko'rish
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() =>
                navigate(`/player/${course.id}`)
              }
              className="w-full rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {course.completedLessons} /{" "}
                    {course.totalLessons} dars yakunlangan
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold text-blue-600">
                  {course.progress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${course.progress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {course.progress === 100
                    ? "Kurs yakunlangan"
                    : "O'qishni davom ettiring"}
                </span>

                <span className="text-sm font-medium text-blue-600">
                  {course.progress === 100
                    ? "Ko'rish →"
                    : "Davom ettirish →"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}