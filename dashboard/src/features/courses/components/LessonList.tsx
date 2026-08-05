import type { Lesson } from "../types/course";

interface Props {
  lessons: Lesson[];
}

export default function LessonList({
  lessons,
}: Props) {
  return (
    <section className="rounded-xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Darslar
      </h2>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                {lesson.order}. {lesson.title}
              </h3>

              <p className="text-sm text-slate-500">
                {lesson.duration} daqiqa
              </p>
            </div>

            {lesson.isPreview ? (
              <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                Preview
              </span>
            ) : (
              <span className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600">
                Yopiq
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}