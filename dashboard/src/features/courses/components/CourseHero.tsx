import type { Course } from "../types/course";

interface Props {
  course: Course;
}

export default function CourseHero({
  course,
}: Props) {
  return (
    <section className="rounded-xl bg-white p-8 shadow">
      <div className="space-y-4">
        <span className="inline-block rounded bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {course.level}
        </span>

        <h1 className="text-4xl font-bold text-slate-900">
          {course.title}
        </h1>

        <p className="text-slate-600">
          {course.description}
        </p>
      </div>
    </section>
  );
}